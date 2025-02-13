using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Helpers;
using api.Interface;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/programinglanguage")]
    [ApiController]
    public class ProgramingLanguageController : ControllerBase
    {
        private readonly IProgramingLanguageService _proLanguageService;
        private readonly ISubmissionService _subService;
        public ProgramingLanguageController(IProgramingLanguageService proLanguageService, ISubmissionService subService)
        {
            _proLanguageService = proLanguageService;
            _subService = subService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProLanguage()
        {
            var proLanguageDto = await _proLanguageService.GetAllProLanguageAsync();

            if (proLanguageDto == null)
                return NotFound("There are no programing language");

            return Ok(proLanguageDto);
        }

        [HttpGet]
        [Route("{proId}")]
        public async Task<IActionResult> GetProLanguageSkill([FromQuery] ProgrammingLanguageQueryObject query, [FromRoute] string proId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var submissionAcs = await _subService.GetAllSubmissionByUserAndProLanguageAsync(query.UserId, proId, query.isAccepted);

            if (submissionAcs == null)
                return Ok(new { numOfSubmission = 0 });

            return
                Ok(new { numOfSubmission = submissionAcs.Count });
        }
    }
}