using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interface.Repository;
using api.Interface.Services;
using api.Model;

namespace api.Services
{
    public class TestCaseStatusService : ITestCaseStatusService
    {
        private readonly ITestCaseStatusRepository _testcaseStatusRepo;
        public TestCaseStatusService(ITestCaseStatusRepository testCaseStatusRepository)
        {
            _testcaseStatusRepo = testCaseStatusRepository;
        }

        public Task<TestCaseStatus> AddTestcaseStatusAsync(TestCaseStatus testCaseStatus)
        {
            return _testcaseStatusRepo.AddTestcaseStatusAsync(testCaseStatus);
        }
    }
}