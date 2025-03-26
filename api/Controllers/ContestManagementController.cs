using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using api.Dtos.ContesRegistation;
using api.Helpers;
using api.Interface;
namespace api.Controllers
{
     [Route("/api/ContestManagement")]
    [ApiController]
    public class ContestManagement : ControllerBase
    {
      
        private readonly IContestService _contestService;
        private readonly IContestRegistationService _contestRegisService;
        public ContestManagement(IContestService contestService, IContestRegistationService contestRegisService)
        {
            _contestService = contestService;
            _contestRegisService = contestRegisService;
        }
        
     [HttpGet]
        public async Task<IActionResult> GetAllContest([FromQuery] ContestManagementQueryObject query)
        {
            var contest= await _contestService.GetxContestAsync(query);
            if (query.PageNumber > contest.TotalPages)
            {
                return NotFound();
            }
            return Ok(contest);
        }
    }
}