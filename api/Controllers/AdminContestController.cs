using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interface;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/AdminDashboard")]
    public class AdminContestController : ControllerBase
    {
         private readonly IContestService _contestService;
         public AdminContestController(IContestService contestService)
         {
            _contestService = contestService;
         }
       
        [HttpGet]
         [Route("contest")]
        public async Task<IActionResult> GetAllContest()
        {
           
                var contests = await _contestService.GetXNewestContestAsync(10);

                if (contests == null)
                    return NotFound("There are no contest.");

                return Ok(contests);
            
        }
    }
}