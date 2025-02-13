using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Admin;
using api.Helpers;
using api.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace api.Controllers
{
    [ApiController]
    [Route("api/AdminDashboard")]
    public class AdminProblemController : ControllerBase
    {
        private readonly IProblemAdminService _IProblemAdminService;
        public AdminProblemController(IProblemAdminService IProblemAdminService)
        {
            _IProblemAdminService= IProblemAdminService;
        }
        [HttpPost("problem")]
      public async Task<IActionResult> ProbSort([FromQuery] ProblemDashboardQueryObject probOb)
{
    
           var ListProb= await _IProblemAdminService.GetxProblemDashBoardMostAttemped(probOb.NumberOfProb,probOb.Asc);
         if (probOb.Asc)
    {
        ListProb = ListProb.OrderBy(p => p.NumberOfSubmissions).ToList(); 
    }
    else
    {
        ListProb = ListProb.OrderByDescending(p => p.NumberOfSubmissions).ToList(); 
    }
    
            
            return Ok(ListProb.Take(probOb.NumberOfProb).ToList());
           
        }
        [HttpGet("TotalProb")]
        
    }
}