using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using api.Dtos.Admin;
using api.Interface;
using api.Model;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
namespace api.Controllers
{
    [ApiController]
    [Route("api/AdminLogin")]
    public class AdminLoginController : ControllerBase
    {
    public AdminLoginController()
    {
        
    }
    [HttpPost]
     public async Task<IActionResult> LoginAdmin([FromBody] LoginAdminDto loginAdminDto)
        {
            if (loginAdminDto.Username != "admin"||loginAdminDto.Password!= "admin") 

             return Unauthorized("Username not found or password incorrect");

            else
            return  Ok(true);
        }
    }

}