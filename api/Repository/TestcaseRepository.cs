using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interface.Repository;
using api.Model;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class TestCaseRepository : ITestCaseRepository
    {
        private readonly ApplicationDBContext _context;
        public TestCaseRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<TestCase>> GetAllTestCaseByProblemIdAsync(string problemId)
        {
            var testCases = await _context.TestCases
                                .Where(x => x.ProblemId == problemId)
                                .Include(x => x.Problem)
                                .ToListAsync();

            return testCases;
        }
        public async Task CreateTestCaseAsync(List<TestCase> tests)
        {
            await _context.TestCases.AddRangeAsync(tests);
            await _context.SaveChangesAsync();
        }

        public Task<TestCase> GetTestCaseById(string testcaseId)
        {
            var testcase = _context.TestCases
                .FirstOrDefaultAsync(x => x.TestCaseId == testcaseId);

            return testcase;
        }
    }
}