using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using api.Interface;
using Microsoft.AspNetCore.Http.HttpResults;

namespace api.Services
{
    public class UserService : IUserService
    {
        private readonly IContestRegistationRepository _contestRegisRepo;
        private readonly IUserRepository _userRepo;
        private readonly IContestRepository _contestRepo;
        public UserService(IContestRegistationRepository contestRegisRepo, IUserRepository userRepo, IContestRepository contestRepo)
        {
            _contestRegisRepo = contestRegisRepo;
            _userRepo = userRepo;
            _contestRepo = contestRepo;
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
            smtp.Credentials = new NetworkCredential(from,password);
            try
            {
                smtp.Send(mail);
                Console.WriteLine("Gửi email thành công!");
                
            }catch(Exception ex)
            {
                Console.WriteLine("Lỗi khi gửi email: " + ex.Message);
            }
        }

    }
    
}