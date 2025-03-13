using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Helpers;
using api.Interface.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace api.Controllers
{
    [Route("api/testcase")]
    [ApiController]
    public class TestCaseController : ControllerBase
    {
        private readonly ITestCaseService _testCaseService;
        public TestCaseController(ITestCaseService testCaseService)
        {
            _testCaseService = testCaseService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTestCase([FromQuery] TestCaseQueryObject query)
        {
            var testCases = await _testCaseService.GetAllTestCaseByProblemIdAsync(query.ProblemId);

            if (testCases == null)
                return NotFound("This problem has no test case.");

            return Ok(testCases);
        }
    }
}