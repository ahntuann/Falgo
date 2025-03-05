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
        public async Task DeleteProblem(string ProblemID)
        {
            await _context.Problems.Where(p => p.ProblemId==ProblemID).ExecuteDeleteAsync();
        }
    }
}