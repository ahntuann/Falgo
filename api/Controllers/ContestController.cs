using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Helpers;
using api.Interface;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("/api/contest")]
    [ApiController]
    public class ContestController : ControllerBase
    {
        private readonly IContestService _contestService;
        public ContestController(IContestService contestService)
        {
            _contestService = contestService;
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

            return BadRequest();
        }
    }
}