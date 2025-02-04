using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Problem;
using api.Helpers;

namespace api.Interface
{
    public interface IProblemService
    {
        Task<List<ViewAllProblemDto>> GetAllProblemsWithStatsAsync(string userId, QueryObject query);
    }
}