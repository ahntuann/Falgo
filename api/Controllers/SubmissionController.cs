using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Problem;
using api.Dtos.ProgramingLanguage;
using api.Dtos.TestCase;
using api.Helpers;
using api.Interface;
using api.Interface.Services;
using api.Model;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("/api/submission")]
    [ApiController]
    public class SubmissionController : ControllerBase
    {
        private readonly ISubmissionService _submissionService;
        private readonly IProgramingLanguageService _proLangService;
        private readonly ITestCaseService _testCaseService;
        private readonly IProblemService _proService;
        public SubmissionController(
            ISubmissionService subService,
            IProgramingLanguageService proLangService,
            ITestCaseService testCaseService,
            IProblemService proService)
        {
            _proLangService = proLangService;
            _submissionService = subService;
            _testCaseService = testCaseService;
            _proService = proService;
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
                string baseURL = "/Users/macbook/docker_tmp";
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
                    string dockerCommand = $"docker run --rm -v '{baseURL}:/app' {dockerImage} /bin/bash -c '{fixPermissionCommand} && {compileCommand} && {runCommand}'";

                    var output = await ExecuteCommand(dockerCommand, outputPath, testCase, problem);

                    testCaseStatuses.Add(output);
                }

                Directory.Delete(baseURL, true);

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
                "Python" => $"python /app/{fileName} < /app/input.txt > /app/output.txt",
                "C++" => $"/app/main < /app/input.txt > /app/output.txt",
                "Java" => $"java -cp /app/ Main < /app/input.txt > /app/output.txt",
                _ => throw new ArgumentException("Not support this programming language")
            };
        }

        private async Task<TestCaseStatusDto> ExecuteCommand(
            string command,
            string outputPath,
            TestCase testCase,
            ProblemDetailDto problemDetailDto)
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
    }
}