using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Problem;
using api.Dtos.ProgramingLanguage;
using api.Dtos.TestCase;
using api.Helpers;
using api.Interface;
using api.Interface.Services;
using api.Mappers;
using api.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace api.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class SubmissionController : ControllerBase
    {
        private readonly ExecutionConfig _executionConfig;
        private readonly ISubmissionService _submissionService;
        private readonly IProgramingLanguageService _proLangService;
        private readonly ITestCaseService _testCaseService;
        private readonly IProblemService _proService;
        private readonly ITestCaseStatusService _testcaseStatusService;
        private readonly ApplicationDBContext _context;
        public SubmissionController(
            ISubmissionService subService,
            IProgramingLanguageService proLangService,
            ITestCaseService testCaseService,
            IProblemService proService,
            ITestCaseStatusService testCaseStatusService,
            ApplicationDBContext context,
            IConfiguration configuration)
        {
            _proLangService = proLangService;
            _submissionService = subService;
            _testCaseService = testCaseService;
            _proService = proService;
            _testcaseStatusService = testCaseStatusService;
            _executionConfig = configuration.GetSection("ExecutionConfig").Get<ExecutionConfig>();
            _context = context;
        }

        [HttpGet("{problemId}")]
        public async Task<IActionResult> GetAllSubmissionsByProblem(string problemId, [FromQuery] SubmissionListQueryObject query)
        {
            var userId = query.UserId;
            if (string.IsNullOrEmpty(userId))
            {
                userId = string.Empty;
            }
            query.ProblemId = problemId;
            var result = await _submissionService.GetAllSubmissionByProblem(query, userId);

            if (!result.Items.Any())
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet("username")]
        public async Task<IActionResult> GetSubmitterUsernames(string problemId)
        {
            var submitterName = await _submissionService.GetAllSubmitterUsernameAsync(problemId);
            return Ok(submitterName);
        }

        [HttpGet("status")]
        public async Task<IActionResult> GetSubmissionStatus(string problemId)
        {
            var statuses = await _submissionService.GetAllSubmissionStatusAsync(problemId);
            return Ok(statuses);
        }

        [HttpGet("language")]
        public async Task<IActionResult> GetSubmissionLanguage(string problemId)
        {
            var languages = await _submissionService.GetAllSubmissionLanguageAsync(problemId);
            return Ok(languages);
        }

        [HttpPost]
        public async Task<IActionResult> PostASubmission([FromBody] SubmissionPostDto submissionPostDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                string baseURL = RuntimeInformation.IsOSPlatform(OSPlatform.Windows) ?
                                 _executionConfig.WindowsBasePath :
                                 _executionConfig.MacBasePath;

                Directory.CreateDirectory(baseURL);

                ProgramingLanguageDto proLangDto = await _proLangService.GetProgramingLanguageAsync(submissionPostDto.ProgrammingLanguageId);
                if (proLangDto == null)
                    return BadRequest(new { Error = "Not support this programming language" });

                string fileName = GetFileName(proLangDto.Language);
                string filePath = Path.Combine(baseURL, fileName);
                await System.IO.File.WriteAllTextAsync(filePath, submissionPostDto.SourceCode);

                string dockerImage = GetDockerImage(proLangDto.Language);
                string compileCommand = GetCompileCommand(proLangDto.Language, fileName);

                List<TestCase> testCases = await _testCaseService.GetAllTestCaseByProblemIdAsync(submissionPostDto.ProblemID);
                ProblemDetailDto problem = await _proService.GetProblemDetailByIdAsync(submissionPostDto.ProblemID);
                List<TestCaseStatusDto> testCaseStatuses = new List<TestCaseStatusDto>();

                int numOfExecution = submissionPostDto.IsTestCode ? 3 : 10;
                int numOfSucces = 0;
                bool isWrongAnswer = false;
                bool isError = false;
                bool isTimeLimitExceed = false;
                double executionTime = 0;

                for (int i = 0; i < 10; i++)
                {
                    TestCase testCase = testCases.ElementAt(i);

                    if (i >= numOfExecution)
                    {
                        testCaseStatuses.Add(new TestCaseStatusDto
                        {
                            TestCaseId = testCase.TestCaseId,
                            Input = testCase.Input,
                            Output = testCase.Output,
                        });

                        continue;
                    }

                    string inputFileName = "input.txt";
                    string outputFileName = "output.txt";

                    string inputPath = Path.Combine(baseURL, inputFileName);
                    string outputPath = Path.Combine(baseURL, outputFileName);

                    await System.IO.File.WriteAllTextAsync(inputPath, testCase.Input);
                    await System.IO.File.WriteAllTextAsync(outputPath, "");

                    string runCommand = GetRunCommand(proLangDto.Language, fileName);

                    string fixPermissionCommand = "chmod -R 777 /app";

                    string dockerCommand;
                    if (compileCommand != "")
                        dockerCommand = $"docker run --rm -v '{baseURL}:/app' {dockerImage} /bin/bash -c '{fixPermissionCommand} && {compileCommand} && {runCommand}'";
                    else
                        dockerCommand = $"docker run --rm -v '{baseURL}:/app' {dockerImage} /bin/bash -c '{fixPermissionCommand} && {runCommand}'";

                    var output = await ExecuteCommand(dockerCommand, outputPath, testCase, problem);

                    if (output.Result == "Success")
                        numOfSucces++;
                    else if (output.Result == "Error")
                        isError = true;
                    else if (output.Result == "Time Limit Exceeded")
                        isTimeLimitExceed = true;
                    else if (output.Result == "Wrong answer")
                        isWrongAnswer = true;

                    executionTime += output.ExecutionTime;

                    testCaseStatuses.Add(output);
                }

                Directory.Delete(baseURL, true);

                if (!submissionPostDto.IsTestCode)
                {
                    string status;
                    if (isError)
                        status = "Compilation Error";
                    else if (isTimeLimitExceed)
                        status = "Time Limit Exceeded";
                    else if (isWrongAnswer)
                        status = "Wrong Answer";
                    else
                        status = "Accepted";

                    if (!submissionPostDto.ContestId.IsNullOrEmpty())
                    {
                        await _submissionService.CreateASubmissionContestAsync(new SubmissionContest
                        {
                            Point = numOfSucces * (problem.TotalPoint / 10),
                            SourceCode = submissionPostDto.SourceCode,
                            Status = status,
                            ExecuteTime = executionTime,
                            MemoryUsed = 1000,
                            ProblemId = submissionPostDto.ProblemID,
                            AppUserId = submissionPostDto.UserId,
                            ProgrammingLanguageId = submissionPostDto.ProgrammingLanguageId,
                            ContestId = submissionPostDto.ContestId,
                            SubmittedAt = DateTime.Now
                        });
                    }
                    else
                    {
                        Submission addedSubmission = new Submission();

                        addedSubmission = await _submissionService.CreateASubmissionAsync(new Submission
                        {
                            Point = numOfSucces * (problem.TotalPoint / 10),
                            SourceCode = submissionPostDto.SourceCode,
                            Status = status,
                            ExecuteTime = executionTime,
                            MemoryUsed = 1000,
                            ProblemId = submissionPostDto.ProblemID,
                            AppUserId = submissionPostDto.UserId,
                            ProgrammingLanguageId = submissionPostDto.ProgrammingLanguageId
                        });

                        var submissionId = addedSubmission.SubmissionId;

                        if (addedSubmission != null)
                            foreach (var testCaseStatus in testCaseStatuses)
                            {
                                var testCase = testCases.FirstOrDefault(x => x.TestCaseId == testCaseStatus.TestCaseId);
                                await _testcaseStatusService.AddTestcaseStatusAsync(new TestCaseStatus
                                {
                                    TestCaseId = testCase.TestCaseId,
                                    SubmissionId = submissionId,
                                    Result = testCaseStatus.Result,
                                    TestCase = testCase,
                                    Submission = addedSubmission,
                                    ExecutionTime = testCaseStatus.ExecutionTime
                                });
                            }
                    }


                }

                return Ok(testCaseStatuses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        private string GetFileName(string language) => language switch
        {
            "Python" => "main.py",
            "C++" => "main.cpp",
            "Java" => "Main.java",
            _ => throw new ArgumentException("Not support this programming language")
        };

        private string GetDockerImage(string language) => language switch
        {
            "Python" => "python:3.10",
            "C++" => "gcc:latest",
            "Java" => "openjdk:17",
            _ => throw new ArgumentException("Not support this programming language")
        };

        private string GetCompileCommand(string language, string fileName)
        {
            return language switch
            {
                "Python" => "",
                "C++" => $"g++ /app/{fileName} -o /app/main",
                "Java" => $"javac /app/{fileName}",
                _ => throw new ArgumentException("Not support this programming language")
            };
        }

        private string GetRunCommand(string language, string fileName)
        {
            return language switch
            {
                "Python" => $"python3 /app/{fileName} < /app/input.txt > /app/output.txt",
                "C++" => $"/app/main < /app/input.txt > /app/output.txt",
                "Java" => $"java -cp /app/ Main < /app/input.txt > /app/output.txt",
                _ => throw new ArgumentException("Not support this programming language")
            };
        }

        private async Task<TestCaseStatusDto> ExecuteCommand(string command, string outputPath, TestCase testCase, ProblemDetailDto problemDetailDto)
        {
            var processInfo = new ProcessStartInfo
            {
                FileName = "/bin/bash",
                Arguments = $"-c \"{command}\"",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = new Process { StartInfo = processInfo };
            var stopwatch = Stopwatch.StartNew();
            process.Start();

            bool exited = process.WaitForExit(problemDetailDto.TimeLimit * 1000);
            stopwatch.Stop();

            if (!exited)
            {
                process.Kill();
                return new TestCaseStatusDto
                {
                    TestCaseId = testCase.TestCaseId,
                    Result = "Time Limit Exceeded",
                    Log = "Execution took too long.",
                    TimeLimit = problemDetailDto.TimeLimit,
                    Input = testCase.Input,
                    Output = testCase.Output,
                    ExecutionTime = stopwatch.ElapsedMilliseconds
                };
            }

            var error = await process.StandardError.ReadToEndAsync();

            if (!String.IsNullOrEmpty(error))
                return new TestCaseStatusDto
                {
                    TestCaseId = testCase.TestCaseId,
                    Result = "Error",
                    Log = error,
                    TimeLimit = problemDetailDto.TimeLimit,
                    Input = testCase.Input,
                    Output = testCase.Output,
                    ExecutionTime = stopwatch.ElapsedMilliseconds
                };

            string output = await System.IO.File.ReadAllTextAsync(outputPath);
            string expected = testCase.Output;

            return new TestCaseStatusDto
            {
                TestCaseId = testCase.TestCaseId,
                Result = output.Trim().Equals(expected.Trim()) ? "Success" : "Wrong answer",
                Input = testCase.Input,
                Output = expected,
                ActualOuput = output,
                TimeLimit = problemDetailDto.TimeLimit,
                ExecutionTime = stopwatch.ElapsedMilliseconds
            };
        }

        [HttpGet("languages")]
        public async Task<IActionResult> GetSubmissionLanguages([FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("User ID is required");

            var query = new SubmissionListQueryObject { UserId = userId };
            var languages = await _submissionService.GetAllSubmissionLanguagesByUserAsync(userId);
            return Ok(languages);
        }

        [HttpGet("statuses")]
        public async Task<IActionResult> GetSubmissionStatuses([FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("User ID is required");

            var statuses = await _submissionService.GetAllSubmissionStatusesByUserAsync(userId);
            return Ok(statuses);
        }

        [HttpGet("history/{problemId}/{userId}")]
        public async Task<IActionResult> GetSubmissionHistory(string problemId, string userId, [FromQuery] SubmissionHistoryQueryObject query)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }
            if (string.IsNullOrEmpty(problemId))
            {
                return BadRequest();
            }
            var result = await _submissionService.GetSubmissionHistory(userId, problemId, query);
            return Ok(result);
        }
        [HttpGet("history/status/{problemId}/{userId}")]
        public async Task<IActionResult> GetSubmissionHistoryStatus(string problemId, string userId)
        {
            if (string.IsNullOrEmpty(problemId))
            {
                return BadRequest();
            }
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest();
            }
            var statuses = await _submissionService.GetAllSubmissionHistoryStatusesAsync(userId, problemId);
            return Ok(statuses);
        }

        [HttpGet("bestSubmission")]
        public async Task<IActionResult> GetBestSubmissionContest([FromQuery] BestSubmissionContestQueryObject query)
        {
            if (query.ContestId.IsNullOrEmpty() ||
                query.ProblemId.IsNullOrEmpty() ||
                (query.UserId.IsNullOrEmpty() && query.isAll == false))
                return BadRequest("Missing required attributes");

            if (!query.UserId.IsNullOrEmpty())
            {
                SubmissionContest submission = await _submissionService
                    .GetBestSubmisisonContest(query.UserId, query.ContestId, query.ProblemId);

                return Ok(submission);
            }
            else
            {
                List<SubmissionContest> submissions = new List<SubmissionContest>();

                return Ok(submissions);
            }
        }
    }
}