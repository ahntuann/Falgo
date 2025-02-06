using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ProblemHomePage;
using api.Model;

namespace api.Mappers
{
    public static class ProblemHomePageMapper
    {
        public static ProblemHomePageMostAttempedDto ToProblemHomePageMostAttempedDtoFromProblem(this Problem problem)
        {
            return new ProblemHomePageMostAttempedDto
            {
                ProblemId = problem.ProblemId,
                Category = problem.Category,
                Title = problem.Title,
                Detail = problem.Detail,
                TotalPoint = problem.TotalPoint,
                TimeLimit = problem.TimeLimit,
                MemoryLimit = problem.MemoryLimit,
                Author = problem.Author,
            };
        }

        public static ProblemHomePageMostAttempedDto AddNumAttempted(this ProblemHomePageMostAttempedDto problem, int numAttempted)
        {
            return new ProblemHomePageMostAttempedDto
            {
                ProblemId = problem.ProblemId,
                Category = problem.Category,
                Title = problem.Title,
                Detail = problem.Detail,
                TotalPoint = problem.TotalPoint,
                TimeLimit = problem.TimeLimit,
                MemoryLimit = problem.MemoryLimit,
                Author = problem.Author,
                TimeAttempted = numAttempted
            };
        }
    }
}