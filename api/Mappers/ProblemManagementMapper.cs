using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Admin;
using api.Model;

namespace api.Mappers
{
    public static class ProblemManagementMapper
    {
        public static ViewProblemManagementDto ProblemManagementDto (this Problem problem, List<Submission> submissions)
        {

            int totalSubmissions = submissions.Count;
            int acceptedSubmissions = submissions.Count(s => s.Status == "Accepted");

            var problemManagementDto = new ViewProblemManagementDto
            {
                ProblemId = problem.ProblemId,
                Title = problem.Title,
                Category = problem.Category ?? "Không định dạng",
                Score = problem.TotalPoint,
                AcceptanceRate = totalSubmissions > 0
                ? Math.Round((double)acceptedSubmissions / totalSubmissions * 100, 2)
            : 0,
                AcceptedCount = acceptedSubmissions,
            };

            return problemManagementDto;
        }
        public static List<TestCase> ToTestcaseFromTestcaseDto(this List<TestcaseDto> testcaseDto,String ProblemID) 
        {
            return testcaseDto.Select(dto => new TestCase
            {
               TestCaseId  = Guid.NewGuid().ToString(),
               ProblemId = ProblemID, 
              Input = dto.Input,
              Output = dto.Output
             }).ToList();
        }
        public static Problem ToProblemFromProblemDto(this ProblemDto problemDto)
        {
            return new Problem{
            ProblemId=problemDto.ProblemId,
            Category=problemDto.Category,
            Title=problemDto.Title,
            Detail=problemDto.Detail,
            Input=problemDto.Input,
            Output=problemDto.Output,
            TotalPoint=int.Parse(problemDto.TotalPoint),
             TimeLimit =int.Parse(problemDto.TimeLimit),
             MemoryLimit =int.Parse(problemDto.MemoryLimit),
             Author=problemDto.Author,
            Solution=problemDto.Solution,
            };
        }
    }
}