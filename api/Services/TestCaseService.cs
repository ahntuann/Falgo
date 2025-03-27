using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interface.Repository;
using api.Interface.Services;
using api.Model;

namespace api.Services
{
    public class TestCaseService : ITestCaseService
    {
        private readonly ITestCaseRepository _testCaseRepo;
        public TestCaseService(ITestCaseRepository testCaseRepo)
        {
            _testCaseRepo = testCaseRepo;
        }

        public async Task<List<TestCase>> GetAllTestCaseByProblemIdAsync(string problemId)
        {
            return await _testCaseRepo.GetAllTestCaseByProblemIdAsync(problemId);
        }

        public Task<TestCase> GetTestCaseById(string testcaseId)
        {
            return _testCaseRepo.GetTestCaseById(testcaseId);
        }
    }
}