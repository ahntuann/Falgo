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
    public class TestCaseStatusRepository : ITestCaseStatusRepository
    {
        private readonly ApplicationDBContext _context;
        public TestCaseStatusRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<TestCaseStatus> AddTestcaseStatusAsync(TestCaseStatus testCaseStatus)
        {
            try
            {
                if (testCaseStatus.Submission != null)
                {
                    _context.Entry(testCaseStatus.Submission).State = EntityState.Unchanged;
                }
                if (testCaseStatus.TestCase != null)
                {
                    _context.Entry(testCaseStatus.TestCase).State = EntityState.Unchanged;
                }

                var testCase = await _context.TestCases
                    .FirstOrDefaultAsync(x => x.TestCaseId == testCaseStatus.TestCaseId);

                testCaseStatus.TestCaseId = testCase.TestCaseId;

                if (testCase != null)
                {
                    await _context.TestCaseStatus
                        .AddAsync(testCaseStatus);

                    await _context.SaveChangesAsync();
                }

                return testCaseStatus;
            }
            catch (System.Exception ex)
            {
                throw ex;
            }
        }
    }
}