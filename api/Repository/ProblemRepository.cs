using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Problem;
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
    }
}