using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Helpers;
using api.Interface;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("/api/submission")]
    [ApiController]
    public class SubmissionController : ControllerBase
    {
        private readonly ISubmissionService _submissionService;
        public SubmissionController(ISubmissionService subService)
        {
            _submissionService = subService;
        }

        [HttpGet("{problemId}")]
        public async Task<IActionResult> GetAllSubmissionsByProblem(string problemId, [FromQuery] SubmissionListQueryObject query)
        {
            var userId = query.UserId;
            if (string.IsNullOrEmpty(userId))
            {
                userId = string.Empty;
            }
            query.ProblemId = problemId;
            var result = await _submissionService.GetAllSubmissionByProblem(query, userId);

            if (!result.Items.Any())
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet("username")]
        public async Task<IActionResult> GetSubmitterUsernames(string problemId)
        {
            var submitterName = await _submissionService.GetAllSubmitterUsernameAsync(problemId);
            return Ok(submitterName);
        }

        [HttpGet("status")]
        public async Task<IActionResult> GetSubmissionStatus(string problemId)
        {
            var statuses = await _submissionService.GetAllSubmissionStatusAsync(problemId);
            return Ok(statuses);
        }

        [HttpGet("language")]
        public async Task<IActionResult> GetSubmissionLanguage(string problemId)
        {
            var languages = await _submissionService.GetAllSubmissionLanguageAsync(problemId);
            return Ok(languages);
        }
    }
}