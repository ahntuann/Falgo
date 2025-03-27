using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Helpers;
using api.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.IO;
using api.Dtos.User;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace api.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IWebHostEnvironment _env;
        private readonly ISubmissionRepository _subRepo;
        private readonly IProgramingLanguageRepository _programingLanguageRepository;
        private readonly IProblemRepository _problemRepository;
        public UserController(IUserService userService, IWebHostEnvironment env, ISubmissionRepository subRepo,
                            IProgramingLanguageRepository programingLanguageRepository,
                            IProblemRepository problemRepository)
        {
            _userService = userService;
            _env = env;
            _subRepo = subRepo;
            _programingLanguageRepository = programingLanguageRepository;
            _problemRepository = problemRepository;
        }

        [HttpGet("isRegis")]
        public async Task<IActionResult> CheckIfUserRegisContest([FromQuery] UserQueryObject query)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var isRegis = await _userService.IsUserRegisContest(query.UserId, query.ContestId);

            if (isRegis == null)
                return BadRequest("Invalid User or Contest");
            else if (isRegis == false)
                return Ok(new { isRegis = false });
            else
                return Ok(new { isRegis = true });
        }

        [HttpGet("profile/{userId}")]
        public async Task<IActionResult> GetUserProfile(string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("User ID is required");

            var profile = await _userService.GetUserProfile(userId);

            if (profile == null)
                return NotFound("User not found");

            return Ok(profile);
        }
        [HttpPut("update/{userId}")]
        public async Task<IActionResult> UpdateUser(string userId, [FromBody] UpdateUserDto updateUserDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
                
            var result = await _userService.UpdateUserAsync(userId, updateUserDto);
            
            if (!result)
                return BadRequest("Failed to update user information or user not found");
                
            return Ok(new { success = true, message = "User information updated successfully" });
        }

        [HttpPost("update-avatar/{userId}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateAvatar([FromForm] AvatarUpdateDto dto, [FromRoute] string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("User ID is required");
                    
            if (dto.Avatar == null || dto.Avatar.Length == 0)
                return BadRequest("Avatar file is required");
                    
            // Kiểm tra loại file
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var extension = Path.GetExtension(dto.Avatar.FileName).ToLowerInvariant();
                
            if (!allowedExtensions.Contains(extension))
                return BadRequest("Invalid file type. Only image files (jpg, jpeg, png, gif) are allowed.");
                    
            // Kiểm tra kích thước file 
            if (dto.Avatar.Length > 5 * 1024 * 1024)
                return BadRequest("File size exceeds the limit (5MB).");
                    
            var result = await _userService.UpdateUserAvatarAsync(userId, dto.Avatar);
                
            if (result.Success)
                return Ok(new {
                    success = true,
                    message = "Avatar updated successfully",
                    avatarUrl = result.AvatarUrl
                });
            else
                return BadRequest("Failed to update avatar. User may not exist.");
        }

        [HttpGet("download-avatar/{userId}")]
        public async Task<IActionResult> DownloadAvatar(string userId)
        {
            var user = await _userService.GetUserByIdAsync(userId);
            
            if (user == null || string.IsNullOrEmpty(user.Avatar))
                return NotFound("Avatar not found");
            
            // Lấy đường dẫn vật lý đến file avatar
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", user.Avatar.TrimStart('/'));
            
            if (!System.IO.File.Exists(filePath))
                return NotFound("Avatar file not found");
            
            // Xác định loại MIME
            var provider = new FileExtensionContentTypeProvider();
            string contentType;
            if (!provider.TryGetContentType(filePath, out contentType))
            {
                contentType = "application/octet-stream";
            }
            
            // Đọc nội dung file
            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            
            // Trả về file để tải xuống
            return File(fileBytes, contentType, Path.GetFileName(filePath));
        }

        [HttpGet("avatar/{userId}")]
        public async Task<IActionResult> GetAvatarUrl(string userId)
        {
            var user = await _userService.GetUserByIdAsync(userId);
            
            if (user == null || string.IsNullOrEmpty(user.Avatar))
                return NotFound("Avatar not found");
            
            return Ok(new { avatarUrl = user.Avatar });
        }

        [HttpGet("{userId}/submissions")]
        public async Task<IActionResult> GetUserSubmissions(string userId, [FromQuery] SubmissionListQueryObject query)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("User ID is required");

            if (query.PageNumber <= 0)
                query.PageNumber = 1;
            if (query.PageSize <= 0)
                query.PageSize = 10;

            var submissions = await _userService.GetUserSubmissionsAsync(userId, query);

            if (submissions == null)
                return NotFound("User not found or has no submissions");

            return Ok(submissions);
        }

        [HttpGet("{userId}/contests")]
        public async Task<IActionResult> GetUserContests(string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("User ID is required");

            var contests = await _userService.GetUserContestsAsync(userId);

            if (contests == null)
                return NotFound("User not found");

            if (contests.Count == 0)
                return Ok(new { message = "User has not participated in any contests", contests });

            return Ok(contests);
        }
        [HttpGet("download-submission/{submissionId}")]
        public async Task<IActionResult> DownloadSubmissionSource(string submissionId)
        {
            var submission = await _subRepo.GetSubmissionByIdAsync(submissionId);
            
            if (submission == null)
                return null;

            var sourceCodeZip = await _userService.DownloadSubmissionSourceCodeAsync(submissionId);
            string problemTitle = await _problemRepository.GetProblemNameByIdAsync(submission.ProblemId);
            string languageName = await _programingLanguageRepository.GetLanguageNameByIdAsync(submission.ProgrammingLanguageId);
            
            string cleanProblemTitle = RemoveSpecialCharacters(problemTitle);
            if (sourceCodeZip == null)
                return NotFound();

            return File(sourceCodeZip, "application/zip", $"{submission.ProblemId}_{cleanProblemTitle}_{languageName}.zip");
        }

        private string RemoveSpecialCharacters(string input)
        {
            return System.Text.RegularExpressions.Regex.Replace(input, @"[^a-zA-Z0-9_]", "");
        }

        [HttpPost("commit/{submissionId}")]
        [Authorize]
        public async Task<IActionResult> CommitSubmissionToGitHub(string submissionId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID not found.");
            }

            try
            {
                bool success = await _userService.CommitSubmissionToGitHub(userId, submissionId);
                if (success)
                {
                    return Ok("Submission committed successfully.");
                }
                return BadRequest("Failed to commit submission.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{userId}/top-languages")]
        public async Task<IActionResult> GetUserTopProgrammingLanguages(string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("User ID is required");

            try 
            {
                var topLanguages = await _userService.GetTopProgrammingLanguagesAsync(userId);

                if (topLanguages == null || !topLanguages.Any())
                    return NotFound("No programming language usage data found");

                return Ok(new 
                {
                    message = "Top 5 Programming Languages",
                    data = topLanguages
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving top programming languages", error = ex.Message });
            }
        }

        [HttpGet("{userId}/problem-categories")]
        public async Task<IActionResult> GetUserProblemCategoryPercentages(string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("User ID is required");

            try 
            {
                var categoryPercentages = await _userService.GetProblemCategoryPercentageAsync(userId);

                if (categoryPercentages == null || !categoryPercentages.Any())
                    return NotFound("No problem category data found");

                return Ok(new 
                {
                    message = "Problem Category Percentages",
                    data = categoryPercentages
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving problem category percentages", error = ex.Message });
            }
        }
    }
}