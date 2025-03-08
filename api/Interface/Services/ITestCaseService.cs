using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Model;

namespace api.Interface.Services
{
    public interface ITestCaseService
    {
        public Task<List<TestCase>> GetAllTestCaseByProblemIdAsync(string problemId);
    }
}