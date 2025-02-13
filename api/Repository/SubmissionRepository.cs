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

        public async Task<List<Submission>> GetAllSubmissionAtMonthAsync(int month, int year)
        {
            return await _context.Submissions.Where(x => x.SubmittedAt.Year == year && x.SubmittedAt.Month == month).Include(x => x.Problem).Include(x => x.AppUser).ToListAsync();
        }

        public async Task<List<Submission>> GetSubmissionsByProblemIdAsync(string problemId)
        {
            return await _context.Submissions
    .Include(s => s.AppUser)
    .Where(s => s.Problem.ProblemId == problemId)
    .ToListAsync();
        }
        public async Task<List<Submission>> GetAllSubmissionsAsync()
        {
            return await _context.Submissions.ToListAsync();
        }
    }
}