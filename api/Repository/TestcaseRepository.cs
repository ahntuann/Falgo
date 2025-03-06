using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interface.Repository;
using api.Model;

namespace api.Repository
{
    public class TestcaseRepository :ITestcaseRepository
    {
          private readonly ApplicationDBContext _context;
        public TestcaseRepository(ApplicationDBContext context)
        {
            _context=context;
        }  
        public async Task CreateTestCaseAsync(List<TestCase> tests)
{
    await _context.TestCases.AddRangeAsync(tests);
    await _context.SaveChangesAsync(); // Ensure data is saved
}

    }
}