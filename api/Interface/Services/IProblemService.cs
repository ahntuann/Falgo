using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Problem;
using api.Helpers;
using api.Model;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace api.Interface
{
    public interface IProblemService
    {
        Task<PageResult<ViewAllProblemDto>> GetAllProblemsWithStatsAsync(string userId, ProblemListQueryObject query);
        Task<List<string>> GetAllCategoriesAsync();
        Task<ProblemDetailDto?> GetProblemDetailByIdAsync(string problemId);
        public Task<ProblemSolvingDto?> GetProblemSolvingByIdAsync(string problemId);
        public Task<Problem> GetProblemByIdAsync(string problemId);
    }
}