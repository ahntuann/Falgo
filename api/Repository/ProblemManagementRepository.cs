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
            await _context.SaveChangesAsync();
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
        public async Task<Problem?> GetProblemByIdAsync(string problemId)
        {
            return await _context.Problems.AsNoTracking().FirstOrDefaultAsync(p => p.ProblemId == problemId);
        }
          public async Task<List<Problem>> GetAddedProblemAsync(string contestId)
        {
            var Problem= await  _context.Problems
        .Where(p => _context.ContestProblems
            .Any(cp => cp.ContestId == contestId && cp.ProblemId == p.ProblemId))
        .ToListAsync();
            return Problem;
        }
        public async Task AddProblemToContest(string problemId,string contestId)
        {
            await _context.ContestProblems.AddAsync(new ContestProblem{
                ProblemId=problemId,
                ContestId=contestId,
            });
            await _context.SaveChangesAsync();
        }
        public async Task DeleteProblemFromContest(string problemId,string contestId)
        {
            await _context.ContestProblems.Where(cp => cp.ProblemId == problemId && cp.ContestId == contestId)
            .ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
        }
        public async Task<List<Problem>> GetExistProblemAsync(ContestProblemQueryObject query)
        {
             var Problem=  _context.Problems
        .Where(p => !_context.ContestProblems
            .Any(cp => cp.ContestId == query.ContestId && cp.ProblemId == p.ProblemId))
        .AsQueryable();
        // var problemsQuery = _context.Problems.AsQueryable();
             if (!string.IsNullOrWhiteSpace(query.ProblemTitle))
            {
                var titleLower = query.ProblemTitle.ToLower();
                Problem = Problem.Where(p => p.Title.ToLower().Contains(titleLower));
            }
            return await Problem.ToListAsync();
        }
        public async Task UpdateProblemAsync(Problem problem)
        {
           var problemExist = await _context.Problems.FirstOrDefaultAsync(x => x.ProblemId==problem.ProblemId);
            if (problemExist == null)
            {
                return ;
            }
           
           problemExist. Category=problem.Category;
           problemExist. Title=problem.Title;
           problemExist. Detail=problem.Detail;
          problemExist.  Input=problem.Input;
           problemExist. Output=problem.Output;
           problemExist. TotalPoint=problem.TotalPoint;
           problemExist. TimeLimit =problem.TimeLimit;
          problemExist.   MemoryLimit =problem.MemoryLimit;
          problemExist.   Author=problem.Author;
           problemExist. Solution=problem.Solution;
          await _context.SaveChangesAsync();
        }
    }
}