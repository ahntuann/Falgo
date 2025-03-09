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
                Avatar = user.Avatar,
                Address = user.Address
            };
        }
        
        public async Task<bool> UpdateUserAsync(string userId, UpdateUserDto updateUserDto)
        {
            return await _userRepo.UpdateUserAsync(userId, updateUserDto);
        }

        public async Task<string> UploadAvatarAsync(string userId, IFormFile avatar)
        {
            if (avatar == null || avatar.Length == 0)
                throw new ArgumentException("Vui lòng chọn ảnh để tải lên!");

            // Tạo thư mục lưu ảnh nếu chưa tồn tại
            string uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            // Tạo tên file duy nhất
            string fileName = $"{Guid.NewGuid()}{Path.GetExtension(avatar.FileName)}";
            string filePath = Path.Combine(uploadsFolder, fileName);

            // Lưu ảnh vào thư mục
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await avatar.CopyToAsync(fileStream);
            }

            // Cập nhật đường dẫn ảnh vào database
            var user = await _userRepo.GetUserByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("Người dùng không tồn tại!");

            user.Avatar = $"/uploads/{fileName}";
            await _userRepo.UpdateUserAsync(user);

            return user.Avatar;
        }

    }

}