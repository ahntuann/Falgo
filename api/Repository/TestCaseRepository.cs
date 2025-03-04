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
                                .ToListAsync();

            return testCases;
        }
    }
}