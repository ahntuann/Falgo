using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Helpers;
using api.Model;

namespace api.Interface
{
    public interface IProblemRepository
    {
        public Task<List<Problem>> GetAllProblemAsync();
        public Task<Problem?> GetProblemByIdAsync(string problemId);
        public Task<List<Problem>> GetFilteredProblemsAsync(QueryObject query, string userId);
    }
}