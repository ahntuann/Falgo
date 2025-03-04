using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Model;

namespace api.Interface.Repository
{
    public interface ITestCaseRepository
    {
        public Task<List<TestCase>> GetAllTestCaseByProblemIdAsync(string problemId);
    }
}