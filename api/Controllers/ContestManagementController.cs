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
namespace api.Controllers
{
    [Route("/api/ContestManagement")]
    [ApiController]
    public class ContestManagement : ControllerBase
    {
        private readonly Cloudinary _cloudinary;
        private readonly IContestService _contestService;
        private readonly IContestRegistationService _contestRegisService;
        public ContestManagement(IContestService contestService, IContestRegistationService contestRegisService, Cloudinary cloudinary, IConfiguration config)
        {
            _contestService = contestService;
            _contestRegisService = contestRegisService;
            var account = new Account(
            config["Cloudinary:CloudName"],
            config["Cloudinary:ApiKey"],
            config["Cloudinary:ApiSecret"]
        );

            _cloudinary = new Cloudinary(account);

        }

        [HttpGet]
        public async Task<IActionResult> GetAllContest([FromQuery] ContestManagementQueryObject query)
        {
            var contest = await _contestService.GetxContestAsync(query);
            if (query.PageNumber > contest.TotalPages)
            {
                return NotFound();
            }
            return Ok(contest);
        }
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteContest([FromQuery] string contestId)
        {
            await _contestService.deleteContest(contestId);
            return Ok();
        }
        [HttpPost("AddContest")]
        public async Task<IActionResult> AddContest([FromBody] ContestDto contest)
        {

            var contests = await _contestService.getContestById(contest.ContestId);
            Console.WriteLine("hehe           " + contests);
            if (contests != null) return BadRequest("Đã tồn tại contest Id");

            await _contestService.addContest(contest);
            return Ok();
        }


        [HttpPost("Upload")]
        public async Task<string> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0) return "No file selected.";

            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                PublicId = $"uploads/{Guid.NewGuid()}"
            };

            var result = await _cloudinary.UploadAsync(uploadParams);
            return result.SecureUrl.ToString();
        }


    }
}