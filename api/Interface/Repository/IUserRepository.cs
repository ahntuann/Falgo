using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.User;
using api.Model;

namespace api.Interface
{
    public interface IUserRepository
    {
        public Task<AppUser?> GetUserByIdAsync(string id);
        Task<int> GetUserSolvedCountAsync(string userId);
        Task<int> GetUserSubmissionCountAsync(string userId); 
        Task<bool> UpdateUserAsync(string userId, UpdateUserDto updateUserDto);
        Task<bool> UpdateUser(AppUser user);
        Task UpdateUserAsync(AppUser user);
        

    }
}