using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Model;

namespace api.Interface.Services
{
    public interface ITestCaseStatusService
    {
        public Task<TestCaseStatus> AddTestcaseStatusAsync(TestCaseStatus testCaseStatus);
    }
}