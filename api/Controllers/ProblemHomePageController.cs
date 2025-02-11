using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ProblemHomePage;
using api.Helpers;
using api.Interface;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/problemhome")]
    [ApiController]
    public class ProblemHomePageController : ControllerBase
    {
        private readonly IProblemHomePageServices _proService;
        public ProblemHomePageController(IProblemHomePageServices proService)
        {
            _proService = proService;
        }

        [HttpGet]
        public async Task<IActionResult> getXProblems([FromQuery] ProblemHomePageQueryObject query)
        {
            if (query.MostAttemped == true)
            {
                var problems = await _proService.GetXProblemHomePageMostAttmpedAsync(query.PageSize, DateTime.Now.Month, DateTime.Now.Year);

                if (problems == null)
                {
                    return NotFound("There are no problems in this month");
                }


                return Ok(problems);
            }
            else if (query.NotDone == true)
            {
                var problems = await _proService.GetXProblemAreNotDoneAsync(query.PageSize, query.userId, DateTime.Now.Month, DateTime.Now.Year);

                if (problems == null)
                {
                    return NotFound("There are no problems in this month");
                }


                return Ok(problems);
            }
            else if (query.Done == true)
            {
                var problems = await _proService.GetXProblemDonedAsync(query.PageSize, query.userId, DateTime.Now.Month, DateTime.Now.Year);

                if (problems == null)
                    return NotFound("There are no problems in this month");

                return Ok(problems);
            }

            return BadRequest();
        }
    }
}