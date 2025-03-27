using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Admin;
using api.Dtos.User;
using api.Interface;
using api.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace api.Controllers
{
    [ApiController]
    [Route("api/AdminDashboard")]
    public class AdminUserController : ControllerBase
    {
        private readonly IUserAdminRepository _userAdminRepository;
        private readonly IUserService _userService;
        private readonly IUserRepository _userRepository;
        public AdminUserController(IUserAdminRepository userAdminRepository, IUserService userService, IUserRepository userRepository)
        {
            _userAdminRepository=userAdminRepository;
            _userService = userService;
            _userRepository = userRepository;
        }
       [HttpPost("user")]
       
        public async Task<IActionResult> NumberOfUserWithTime([FromBody] DatetimeFilterDto datetimeFilterDto)
        {
            if (datetimeFilterDto.startDate > datetimeFilterDto.endDate)
        {
            return BadRequest("Start date cannot be later than the end date.");
        }
            int count = await _userAdminRepository.CountNumberOfUsersWithTime(datetimeFilterDto.startDate,datetimeFilterDto.endDate);
            return Ok(count);
        }
        [HttpGet("TotalUser")]
        public async Task<IActionResult> TotalOfUser()
        {
            int count= await _userAdminRepository.TotalOfUser();
            return Ok(count);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userAdminRepository.GetAllUsersAsync();
            foreach (var user in users)
            {
                user.TotalSubmissions = await _userRepository.GetUserSubmissionCountAsync(user.Id);
                user.TotalSolved = await _userRepository.GetUserSolvedCountAsync(user.Id);
            }

            return Ok(users);
            
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserById(string userId)
        {
            var user = await _userAdminRepository.GetUserByIdAsync(userId);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpDelete("user/{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            bool result = await _userAdminRepository.DeleteUserAsync(userId);
            if (result) return Ok("User deleted successfully");
            return NotFound("User not found");
        }

        [HttpPut("user/{userId}")]
        public async Task<IActionResult> UpdateUser(string userId, [FromBody] UpdateUserDto updateUserDto)
        {
            bool result = await _userAdminRepository.UpdateUserByAdminAsync(userId, updateUserDto);
            if (result) return Ok("User updated successfully");
            return BadRequest("Failed to update user");
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

    }
}