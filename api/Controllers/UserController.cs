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

        [HttpPost("upload-avatar/{userId}")]
        public async Task<IActionResult> UploadAvatar(string userId, IFormFile avatar)
        {
            try
            {
                string avatarUrl = await _userService.UploadAvatarAsync(userId, avatar);
                return Ok(new { message = "Cập nhật ảnh đại diện thành công!", avatarUrl });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server!", error = ex.Message });
            }
        }

    }
}