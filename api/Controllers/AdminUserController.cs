using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Admin;
using api.Dtos.User;
using api.Interface;
using api.Repository;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/AdminDashboard")]
    public class AdminUserController : ControllerBase
    {
        private readonly IUserAdminRepository _userAdminRepository;
        public AdminUserController(IUserAdminRepository userAdminRepository)
        {
            _userAdminRepository=userAdminRepository;
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

    }
}