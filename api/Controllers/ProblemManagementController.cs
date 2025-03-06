using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using api.Helpers;
using api.Interface.Services;
using api.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace api.Controllers
{
    [Route("api/problemManagement")]
    [ApiController]    public class ProblemManagementController : ControllerBase
    {
        private readonly IProblemManagementService _ProblemManagementService;
        public ProblemManagementController(IProblemManagementService ProblemManagementService)
        {
            _ProblemManagementService =ProblemManagementService;
        }
        [HttpGet]

        public async Task<IActionResult> GetAllProblemsForManagement([FromQuery] ProblemManagamentQueryObject query)
        {
            var result = await _ProblemManagementService.ViewAllProblemtMangagement(query);
            if (query.PageNumber > result.TotalPages)
            {
                return NotFound();
            }
            return Ok(result);
        }
         [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _ProblemManagementService.GetAllCategoriesAsync();
            return Ok(categories);
        }
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteProblem([FromQuery] string ProblemId)
        {
            await _ProblemManagementService.DeleteProblemAsync(ProblemId);
            return Ok();
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateProblem([FromBody] ProblemFormObject problemFormObject)
        {
            Console.WriteLine("ProblemId:   "+problemFormObject.testcase);
            await _ProblemManagementService.AddProblemAsync(problemFormObject);
            return Ok();
        }
        [HttpPut("update")]
        public async Task<IActionResult>UpdateProblem([FromQuery] Problem problem)
        {
            await _ProblemManagementService.UpdateProblemAsync(problem);
            return Ok();
        }
    }
}