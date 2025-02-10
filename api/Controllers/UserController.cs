using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Helpers;
using api.Interface;
using Microsoft.AspNetCore.Mvc;

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
                return Ok(false);
            else
                return Ok(true);
        }
    }
}