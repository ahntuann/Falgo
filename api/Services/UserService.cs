using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using api.Dtos.User;
using api.Interface;
using api.Model;
using Microsoft.AspNetCore.Http.HttpResults;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace api.Services
{
    public class UserService : IUserService
    {
        private readonly IContestRegistationRepository _contestRegisRepo;
        private readonly IUserRepository _userRepo;
        private readonly IContestRepository _contestRepo;
        private readonly IWebHostEnvironment _env;
        public UserService(IContestRegistationRepository contestRegisRepo, IUserRepository userRepo, IContestRepository contestRepo,
                        IWebHostEnvironment env)
        {
            _contestRegisRepo = contestRegisRepo;
            _userRepo = userRepo;
            _contestRepo = contestRepo;
            _env = env;
        }

        public async Task<AppUser> GetUserByIdAsync(string userId)
        {
            return await _userRepo.GetUserByIdAsync(userId);
        }

        public async Task<bool?> IsUserRegisContest(string userId, string contestId)
        {
            var user = await _userRepo.GetUserByIdAsync(userId);
            var contest = await _contestRepo.GetContestByIdAsync(contestId);

            if (user == null || contest == null)
                return null;

            var contestRegis = await _contestRegisRepo.GetContestRegistionByUserAndContestAsync(user, contest);

            return contestRegis != null;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            string from = "wedfalgocode@gmail.com";
            string password = "qisn uzqc pdmn ljuc";
            MailMessage mail = new MailMessage();
            mail.To.Add(toEmail);
            mail.From = new MailAddress(from);
            mail.Subject = subject;
            mail.Body = body;

            SmtpClient smtp = new SmtpClient("smtp.gmail.com");
            smtp.EnableSsl = true;
            smtp.Port = 587;
            smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtp.Credentials = new NetworkCredential(from, password);
            try
            {
                smtp.Send(mail);
                Console.WriteLine("Gửi email thành công!");

            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi khi gửi email: " + ex.Message);
            }
        }

        public async Task<UserProfileDto> GetUserProfile(string userId)
        {
            var user = await _userRepo.GetUserByIdAsync(userId);
            
            if (user == null)
                return null;


            int totalSolved = await _userRepo.GetUserSolvedCountAsync(userId);
            int totalSubmissions = await _userRepo.GetUserSubmissionCountAsync(userId);

            return new UserProfileDto
            {
                UserName = user.UserName,
                FullName = user.FullName,
                Email = user.Email,
                DateOfBirth = user.DateOfBirth,
                PhoneNumber = user.PhoneNumber,
                CreatedAt = user.CreatedAt,
                TotalSubmissions = totalSubmissions,
                TotalSolved = totalSolved,
                Avatar = user.Avatar
            };
        }
            public async Task<bool> UpdateUserAvatar(string userId, IFormFile avatar)
            {
                try
                {
                    var user = await _userRepo.GetUserByIdAsync(userId);
                    if (user == null)
                        return false;

                    // Định nghĩa đường dẫn lưu avatar
                    var uploadsFolder = Path.Combine(_env.WebRootPath, "avatars");
                    if (!Directory.Exists(uploadsFolder))
                        Directory.CreateDirectory(uploadsFolder);

                    // Đặt tên file
                    var fileName = $"{userId}_{Path.GetFileName(avatar.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    // Lưu file vào thư mục
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await avatar.CopyToAsync(stream);
                    }

                    // Cập nhật đường dẫn avatar trong database
                    user.Avatar = $"/avatars/{fileName}";
                    await _userRepo.UpdateUser(user);

                    return true;
                }
                catch
                {
                    return false;
                }
            }

    }

}