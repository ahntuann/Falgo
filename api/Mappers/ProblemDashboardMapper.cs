using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Admin;
using api.Model;
namespace api.Mappers
{
    public static class ProblemDashboardMapper
    {
        public static ProblemDashboardDto ToProblemDashboardDtoFromProblem(this Problem problem)
        {
            return new ProblemDashboardDto 
            {
                ProblemId = problem.ProblemId,
                Category = problem.Category,
                Title = problem.Title,
                Score= problem.TotalPoint,
            };
        }
        public static ProblemDashboardDto AddNumberSub(this ProblemDashboardDto problem,int NumberOfSub )
        {
            return new ProblemDashboardDto
            {
                ProblemId = problem.ProblemId,
                Category = problem.Category,
                Title = problem.Title,
                Score= problem.Score,
                NumberOfSubmissions=NumberOfSub,
            };
        }
    }
}