using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using api.Dto.Account;
using api.Dtos.Account;
using api.Extensions;
using api.Interface;
using api.Model;
using api.Services;
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
        private readonly EmailService _emailService;
        private readonly RedisService _redisService;
        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, SignInManager<AppUser> signInManager, 
                                IConfiguration configuration,EmailService emailService, RedisService redisService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _tokenService = tokenService;
            _emailService = emailService;
            _redisService = redisService;
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
                UserName = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
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

        var frontendUrl = "http://localhost:3000/google-callback";
    return Redirect($"{frontendUrl}?token={token}&id={user.Id}&userName={user.UserName}&email={user.Email}");
}

[HttpGet("github-login")]
public IActionResult GitHubLogin()
{
    var redirectUrl = Url.Action("GitHubLoginCallback", "Account", null, Request.Scheme);
    var properties = _signInManager.ConfigureExternalAuthenticationProperties("GitHub", redirectUrl);
    return Challenge(properties, "GitHub");
}

[HttpGet("signin-github")]
public async Task<IActionResult> GitHubLoginCallback()
{
    var authenticateResult = await HttpContext.AuthenticateAsync("GitHub");
    if (!authenticateResult.Succeeded)
    {
        return BadRequest("GitHub login failed.");
    }

    var claims = authenticateResult.Principal?.Identities?.FirstOrDefault()?.Claims;
    var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
    var accessToken = authenticateResult.Properties.GetTokenValue("access_token");

    string email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

    if (string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(accessToken))
    {
        email = await GetGitHubEmail(accessToken);
    }

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
            FullName = name ?? "GitHub User",
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
    var frontendUrl = "http://localhost:3000/github-callback";
    return Redirect($"{frontendUrl}?token={token}&id={user.Id}&userName={user.UserName}&email={user.Email}");
}

    private async Task<string> GetGitHubEmail(string accessToken)
{
    using (var client = new HttpClient())
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        client.DefaultRequestHeaders.UserAgent.ParseAdd("MyApp");

        var response = await client.GetStringAsync("https://api.github.com/user/emails");
        var emails = JsonSerializer.Deserialize<List<GitHubEmail>>(response);
        var primaryEmail = emails?.FirstOrDefault(e => e.Primary && e.Verified)?.Email;

        return primaryEmail ?? emails?.FirstOrDefault()?.Email;
    }
}

    [HttpPost("send-verification-code")]
        public async Task<IActionResult> SendVerificationCode([FromBody] VerifyUserDto verifyUserDto)
        {
            var user = await _userManager.FindByNameAsync(verifyUserDto.Username);
            if (user == null || user.Email != verifyUserDto.Email)
                return BadRequest("Username hoặc email không đúng!");

            string otp = new Random().Next(100000, 999999).ToString();
            await _redisService.SetOtpAsync(verifyUserDto.Email, otp);
            await _emailService.SendEmailAsync(verifyUserDto.Email, "Mã xác nhận", $"Mã OTP của bạn: {otp}");

            return Ok("Mã xác nhận đã được gửi!");
        }

     [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            var user = await _userManager.FindByNameAsync(changePasswordDto.Username);
            if (user == null || user.Email != changePasswordDto.Email)
                return BadRequest("Thông tin không đúng!");

            bool isOtpValid = await _redisService.VerifyOtpAsync(changePasswordDto.Email, changePasswordDto.OtpCode);
            if (!isOtpValid) return BadRequest("Mã xác nhận không hợp lệ hoặc đã hết hạn!");

            var result = await _userManager.ChangePasswordAsync(user, changePasswordDto.OldPassword, changePasswordDto.NewPassword);
            if (!result.Succeeded) return BadRequest("Mật khẩu cũ không đúng!");

            return Ok("Đổi mật khẩu thành công!");
        }

}
}
