using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Helpers;
using api.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProblemController : ControllerBase
    {
        private readonly IProblemRepository _problemRepository;
        private readonly IProblemService _problemService;

        public ProblemController(IProblemService problemService, IProblemRepository problemRepository)
        {
            _problemService = problemService;
            _problemRepository = problemRepository;
        }

        [HttpGet]

        public async Task<IActionResult> GetAllProblemsForUserAsync([FromQuery] QueryObject query)
        {
            var userId = query.UserId;
            if (string.IsNullOrEmpty(userId))
            {
                userId = string.Empty;
            }
            var categories = await _problemService.GetAllCategoriesAsync();
            var result = await _problemService.GetAllProblemsWithStatsAsync(userId, query);
            if (query.PageNumber > result.TotalPages)
            {
                return NotFound();
            }
            if (string.IsNullOrWhiteSpace(query.IsDescending) ||
                (query.IsDescending != "true" && query.IsDescending != "false"))
            {
                return NotFound();
            }
            if (!categories.Contains(query.ProblemCategory))
            {
                return Ok(result);
            }
            return Ok(result);
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _problemService.GetAllCategoriesAsync();
            return Ok(categories);
        }
        [HttpGet("problemDetail")]
        public async Task<IActionResult> GetProblemDetailById(string problemId)
        {
            if (problemId.IsNullOrEmpty()) return NotFound();
            var problem = await _problemRepository.GetProblemByIdAsync(problemId);
            return Ok(problem);
        }
    }
}