using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interface;
using api.Model;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class SubmissionRepository : ISubmissionRepository
    {
        private readonly ApplicationDBContext _context;

        public SubmissionRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<List<Submission>> GetSubmissionsByProblemIdAsync(string problemId)
        {
            return await _context.Submissions.Where(s => s.Problem.ProblemId.Equals(problemId)).ToListAsync();
        }
    }
}