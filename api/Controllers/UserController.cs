using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Helpers;
using api.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace api.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
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

        [HttpGet("profile")]
        public async Task<IActionResult> GetUserProfile([FromQuery(Name = "userId")] string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("User ID is required");

            var profile = await _userService.GetUserProfile(userId);

            if (profile == null)
                return NotFound("User not found");

            return Ok(profile);
        }

        [HttpPost("update-avatar")]
        public async Task<IActionResult> UpdateAvatar([FromQuery] string userId, [FromForm] IFormFile avatar)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("User ID is required");

            if (avatar == null || avatar.Length == 0)
                return BadRequest("File is required");

            var result = await _userService.UpdateUserAvatar(userId, avatar);

            if (!result)
                return StatusCode(500, "Lỗi khi cập nhật avatar");

            return Ok(new { message = "Avatar cập nhật thành công" });
        }
    }
}