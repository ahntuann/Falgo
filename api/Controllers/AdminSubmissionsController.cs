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
    public class AdminSubmissionsController : ControllerBase
    {
        private readonly ISubmissionsAdminRepository _SubmissionsAdminRepository;
        public AdminSubmissionsController(ISubmissionsAdminRepository SubmissionsAdminRepository)
        {
            _SubmissionsAdminRepository=SubmissionsAdminRepository;
        }
       [HttpPost("submissions")]
       
    public async Task<IActionResult> NumberOfSubmissionsWithTime([FromBody] DatetimeFilterDto datetimeFilterDto)
    {
        if (datetimeFilterDto.startDate > datetimeFilterDto.endDate)
    {
        return BadRequest("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
    }
        int count = await _SubmissionsAdminRepository.CountNumberOfSubmissionsWithTime(datetimeFilterDto.startDate,datetimeFilterDto.endDate);
        return Ok(count);
    }
    [HttpGet("totalSub")]
    public async Task<IActionResult>TotalOfSubnissions()
    {
        int count = await _SubmissionsAdminRepository.TotalOfSubmissions();
        return Ok(count); 
    }
    }
}