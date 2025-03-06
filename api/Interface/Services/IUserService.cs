using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Model;

namespace api.Interface
{
    public interface IUserService
    {
        public Task<bool?> IsUserRegisContest(string userId, string contestId);
        public Task SendEmailAsync(string toEmail, string subject, string body);
        public Task<AppUser> GetUserByIdAsync(string userId);
    }
}