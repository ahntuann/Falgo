using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Problem;
using api.Helpers;
using api.Interface;
using api.Model;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class ProblemRepository : IProblemRepository
    {
        private readonly ApplicationDBContext _context;
        public ProblemRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<Problem>> GetAllProblemAsync()
        {
            return await _context.Problems.ToListAsync();
        }

        public async Task<Problem?> GetProblemByIdAsync(string problemId)
        {
            return await _context.Problems.AsNoTracking().FirstOrDefaultAsync(p => p.ProblemId == problemId);
        }

        public async Task<List<Problem>> GetFilteredProblemsAsync(ProblemListQueryObject query, string userId)
        {
            var problemsQuery = _context.Problems.AsQueryable();
            if (!string.IsNullOrWhiteSpace(query.ProblemCategory))
            {
                var categoryLower = query.ProblemCategory.ToLower();
                problemsQuery = problemsQuery.Where(p => p.Category.ToLower() == categoryLower);
            }

            if (!string.IsNullOrWhiteSpace(query.ProblemTitle))
            {
                var titleLower = query.ProblemTitle.ToLower();
                problemsQuery = problemsQuery.Where(p => p.Title.ToLower().Contains(titleLower));
            }
            if (!string.IsNullOrWhiteSpace(query.HidePassed) &&
                bool.TryParse(query.HidePassed, out bool hidePassed) && hidePassed)
            {
                problemsQuery = problemsQuery.Where(p =>
                    !_context.Submissions
                        .Where(s => s.Problem.ProblemId == p.ProblemId && s.AppUser.Id == userId)
                        .Select(s => s.Status)
                        .Contains("Accepted"));
            }
            return await problemsQuery.ToListAsync();
        }

        public async Task<string> GetProblemNameByIdAsync(string problemId)
        {
            var problem = await _context.Problems.AsNoTracking().FirstOrDefaultAsync(p => p.ProblemId == problemId);
            return  problem?.Title ?? "Unknown Problem";
        }
    }
}