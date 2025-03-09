using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Model;

namespace api.Interface
{
    public interface IUserRepository
    {
        public Task<AppUser?> GetUserByIdAsync(string id);
        Task<int> GetUserSolvedCountAsync(string userId);
        Task<int> GetUserSubmissionCountAsync(string userId); 
        Task UpdateUserAsync(AppUser user);
        Task<bool> UpdateUser(AppUser user);
    }
}