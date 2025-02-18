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
        public static ViewAllProblemDto ToViewAllProblemDto(Problem problem, List<Submission> submissions, string userId)
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
                SolvedStatus = submissions.Any(s => s.AppUser.Id.Equals(userId) && s.Status == "Accepted") ? "Passed" : "Not passed"
            };

            return problemDto;
        }
    }
}