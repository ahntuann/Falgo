using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Dto.Account;
using api.Dtos.Account;
using api.Interface;
using api.Model;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace api.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly ITokenService _tokenService;

        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, SignInManager<AppUser> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _tokenService = tokenService;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if (user == null) return Unauthorized("Invalid username");

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded) return Unauthorized("Username not found or password incorrect");

            return Ok(new NewUserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                DateOfBirth = user.DateOfBirth
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                foreach (var error in ModelState.Values.SelectMany(v => v.Errors))
                {
                    Console.WriteLine(error.ErrorMessage);
                }
                return BadRequest(ModelState);
            }


            var isUserExists = await _userManager.Users.AnyAsync(u => u.UserName == registerDto.Username);
            var isEmailExists = await _userManager.Users.AnyAsync(u => u.Email == registerDto.Email);
            if (isUserExists || isEmailExists)
                return BadRequest("Username/Email is already in use.");

            var user = new AppUser
            {
                UserName = registerDto.Username,
                Email = registerDto.Email,
                FullName = registerDto.FullName,
                CreatedAt = DateTime.UtcNow,
                DateOfBirth = registerDto.DateOfBirth,
                PhoneNumber = registerDto.PhoneNumber,
                Address = registerDto.Address
            };

            var createUser = await _userManager.CreateAsync(user, registerDto.Password);
            if (!createUser.Succeeded) return BadRequest(createUser.Errors);


            var roleResult = await _userManager.AddToRoleAsync(user, "User");
            if (!roleResult.Succeeded) return StatusCode(500, roleResult.Errors);

            return Ok(new NewUserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                DateOfBirth = user.DateOfBirth
            });

        }

[HttpGet("google-login")]
    public IActionResult GoogleLogin()
    {
        var redirectUrl = Url.Action("GoogleLoginCallback", "Account", null, Request.Scheme);
        var properties = _signInManager.ConfigureExternalAuthenticationProperties(GoogleDefaults.AuthenticationScheme, redirectUrl);
        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    
    [HttpGet("signin-google")]
    public async Task<IActionResult> GoogleLoginCallback()
    {
        var authenticateResult = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
        if (!authenticateResult.Succeeded)
        {
            return BadRequest("Google login failed.");
        }

        var claims = authenticateResult.Principal.Identities.FirstOrDefault()?.Claims;
        var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

        if (string.IsNullOrEmpty(email))
        {
            return BadRequest("Email not found.");
        }

        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            user = new AppUser
            {
                UserName = email.Split('@')[0],
                Email = email,
                FullName = name ?? "Google User",
                CreatedAt = DateTime.UtcNow
            };

            var createUser = await _userManager.CreateAsync(user);
            if (!createUser.Succeeded)
            {
                return BadRequest("Failed to create user.");
            }

            await _userManager.AddToRoleAsync(user, "User");
        }

        var token = _tokenService.CreateToken(user);

        return Ok(new
        {
            Id = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            Token = token
        });
    }

   

    }
}
