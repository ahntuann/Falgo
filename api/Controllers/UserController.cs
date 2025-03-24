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

namespace api.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IWebHostEnvironment _env;
        public UserController(IUserService userService, IWebHostEnvironment env)
        {
            _userService = userService;
            _env = env;
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


    }
}