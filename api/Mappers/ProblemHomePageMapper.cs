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

        public static ProblemHomePageMostAttempedDto AddNumAttempted(this ProblemHomePageMostAttempedDto problem, (int numAttempted, int numSucces) data)
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
                TimeAttempted = data.numAttempted,
                NumSucces = data.numSucces
            };
        }

        public static ProblemHomePageNotDoneDto ToProblemHomePageNotDoneFromProblem(this Problem problem, (int point, string status) data)
        {
            return new ProblemHomePageNotDoneDto
            {
                ProblemId = problem.ProblemId,
                Category = problem.Category,
                Title = problem.Title,
                Detail = problem.Detail,
                TotalPoint = problem.TotalPoint,
                TimeLimit = problem.TimeLimit,
                MemoryLimit = problem.MemoryLimit,
                Author = problem.Author,
                Point = data.point,
                Status = data.status
            };
        }

        public static ProblemHomePageDonedDto ToProblemHomePageDonedFromPoblem(this Problem problem)
        {
            return new ProblemHomePageDonedDto
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
    }
}