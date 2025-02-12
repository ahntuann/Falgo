using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Admin;
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
        int count = await _userAdminRepository.CountNumberOfUsersWithTime(datetimeFilterDto.startDate,datetimeFilterDto.endDate);
        return Ok(count);
    }
    }
}