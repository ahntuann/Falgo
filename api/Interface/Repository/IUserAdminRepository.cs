using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.User;
using api.Model;

namespace api.Interface
{
    public interface IUserAdminRepository
    {
        public Task<int>CountNumberOfUsersWithTime(DateTime? startDate,DateTime? endDate);
        public Task<int>TotalOfUser();
        Task<List<AppUser>> GetAllUsersAsync();
        Task<AppUser> GetUserByIdAsync(string userId);
        Task<bool> DeleteUserAsync(string userId);
        Task<bool> UpdateUserByAdminAsync(string userId, UpdateUserDto updateUserDto);
          
    }
}