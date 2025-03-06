using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Model;

namespace api.Interface.Repository
{
    public interface ITestcaseRepository
    {
        public  Task CreateTestCaseAsync(List<TestCase> test);
    }
}