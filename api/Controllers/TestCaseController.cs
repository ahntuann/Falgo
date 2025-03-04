using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interface.Services;
using Microsoft.AspNetCore.Mvc;

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


    }
}