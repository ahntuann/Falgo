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
using api.Model;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using api.Dtos.Contest;
using api.Interface.Services;
namespace api.Controllers
{
     [Route("/api/ContestProblem")]
    [ApiController]
    public class ContestProblem : ControllerBase
    {
       private readonly Cloudinary _cloudinary;
        private readonly IContestService _contestService;
        private readonly IContestRegistationService _contestRegisService;
        private readonly IProblemManagementService _problemService;
        public ContestProblem(IContestService contestService, IContestRegistationService contestRegisService,IProblemManagementService problemservice)
        {
            _contestService = contestService;
            _contestRegisService = contestRegisService; 
            _problemService= problemservice;
        }     
        [HttpGet("Exist")]  
     public async Task<IActionResult> GetExistProblemAsync([FromQuery]ContestProblemQueryObject query)
     {
        var problems= await _problemService.GetExistProblemAsync(query);
        return Ok(problems);
     }
     [HttpGet("Added")]
     public async Task<IActionResult> GetAddedProblemAsync([FromQuery]ContestProblemQueryObject query)
     {
        var problems= await _problemService.GetAddedProblemAsync(query);
        return Ok(problems);
     }
     [HttpGet("Add")]
    public async Task<IActionResult> AddProblemToContest([FromQuery]ContestProblemQueryObject query)
    {
        Console.WriteLine("hehe          "+query.ProblemId+query.ContestId);
        await _problemService.AddProblemToContest(query.ProblemId,query.ContestId);
        return Ok();
    }
    [HttpGet("Delete")]
    public async Task<IActionResult> DeleteProblemFromContest([FromQuery]ContestProblemQueryObject query)
    {
        await _problemService.DeleteProblemFromContest(query.ProblemId,query.ContestId);
        return Ok();
    }
    }
}