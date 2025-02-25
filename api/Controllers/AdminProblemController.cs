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
       private readonly IProblemAdminRepository _IProblemAdminRepository;
        public AdminProblemController(IProblemAdminService IProblemAdminService,IProblemAdminRepository IProblemAdminRepository)
        {
            _IProblemAdminService= IProblemAdminService;
            _IProblemAdminRepository=IProblemAdminRepository ;
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
        public async Task<IActionResult> TotalOfProblems()
        {
            int count = await _IProblemAdminRepository.TotalOfProblemsAsync();
        return Ok(count);
        }
    }
}