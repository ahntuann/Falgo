using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Problem;
using api.Helpers;
using api.Interface;
using api.Interface.Repository;
using api.Model;
using Microsoft.EntityFrameworkCore;
namespace api.Repository

{
    public class ProblemManagementRepository : IProblemManagementRepository
    {
          private readonly ApplicationDBContext _context;
          public ProblemManagementRepository(ApplicationDBContext context)
          {
            _context=context;
          }
        public async Task<List<Problem>> GetAllProblemAsync()
        {
            return await _context.Problems.ToListAsync();
        }
        public async Task DeleteProblemAsync(string ProblemID)
        {
            await _context.Problems.Where(p => p.ProblemId==ProblemID).ExecuteDeleteAsync();
        }
        public async Task CreateProblemAsync(Problem NewProblem)
        {
            await _context.Problems.AddAsync(NewProblem);
        }
        public async Task<List<Problem>> GetFilteredProblemsAsync(ProblemManagamentQueryObject query)
        {
            var problemsQuery = _context.Problems.AsQueryable();
             if (!string.IsNullOrWhiteSpace(query.ProblemTitle))
            {
                var titleLower = query.ProblemTitle.ToLower();
                problemsQuery = problemsQuery.Where(p => p.Title.ToLower().Contains(titleLower));
            }
            Console.WriteLine("ProblemsQuery: " + problemsQuery.Count());
            return await problemsQuery.ToListAsync();
        }
    }
}