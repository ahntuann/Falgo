using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Problem;
using api.Helpers;
using api.Model;

namespace api.Mappers
{
    public static class ProblemMapper
    {
        public static ViewAllProblemDto ToViewAllProblemDto(this Problem problem, List<Submission> submissions, string userId)
        {

            int totalSubmissions = submissions.Count;
            int acceptedSubmissions = submissions.Count(s => s.Status == "Accepted");

            var problemDto = new ViewAllProblemDto
            {
                ProblemId = problem.ProblemId,
                Title = problem.Title,
                Category = problem.Category ?? "Không định dạng",
                Score = problem.TotalPoint,
                AcceptanceRate = totalSubmissions > 0
                ? Math.Round((double)acceptedSubmissions / totalSubmissions * 100, 2)
            : 0,
                AcceptedCount = acceptedSubmissions,
                //dang bi loi doan s => s.AppUser.Id.Equals(userId) ra ket qua la false
                SolvedStatus = submissions.Any(s => s.AppUser.Id.Equals(userId) && s.Status == "Accepted") ? "Passed" : "Not passed"
            };

            return problemDto;
        }

        public static ProblemDetailDto ToProblemDetailDto(this Problem problem)
        {
            var problemDetail = new ProblemDetailDto
            {
                ProblemId = problem.ProblemId,
                Title = problem.Title,
                Detail = problem.Detail,
                Input = problem.Input,
                Output = problem.Output,
                TotalPoint = problem.TotalPoint,
                TimeLimit = problem.TimeLimit,
                Author = problem.Author,
                Category = problem.Category,
                MemoryLimit = problem.MemoryLimit
            };
            return problemDetail;
        }
    }
}