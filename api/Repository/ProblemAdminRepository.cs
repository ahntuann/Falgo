using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Admin;
using api.Interface;
using api.Model;
using Microsoft.EntityFrameworkCore;
namespace api.Repository
{
    public class ProblemAdminRepository : IProblemAdminRepository
    {
         private readonly ApplicationDBContext _context;
        public ProblemAdminRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<Problem>> GetAllProblemAsync()
        {
            return await _context.Problems.ToListAsync();
        }
        public async Task<int> TotalOfProblemsAsync()
        {
            return await _context.Problems.CountAsync();
        }
    }
}