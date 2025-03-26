using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ContesRegistation;
using api.Helpers;
using api.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace api.Controllers
{
    [Route("/api/contest")]
    [ApiController]
    public class ContestController : ControllerBase
    {
        private readonly IContestService _contestService;
        private readonly IContestRegistationService _contestRegisService;
        public ContestController(IContestService contestService, IContestRegistationService contestRegisService)
        {
            _contestService = contestService;
            _contestRegisService = contestRegisService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllContest([FromQuery] ContestQueryObject query)
        {
            if (query.IsNewest == true)
            {
                var contests = await _contestService.GetXNewestContestAsync(query.PageSize);

                if (contests == null)
                    return NotFound("There are no contest.");

                return Ok(contests);
            }
            else if (!query.TypeOfContest.IsNullOrEmpty())
            {
                var contests = await _contestService.GetContestsAsync(query.TypeOfContest);

                return Ok(contests);
            }

            return BadRequest();
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> RegisterContest([FromBody] CreateContestRegistionDto createRegisDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var success = await _contestRegisService.CreateContestRegisAsync(createRegisDto.ContestId, createRegisDto.UserId);

            if (success == null)
                return BadRequest("User or Contest invalid");
            else if (success == false)
                return BadRequest("User already has registered this contest.");
            else
                return Ok();
        }
    }
}