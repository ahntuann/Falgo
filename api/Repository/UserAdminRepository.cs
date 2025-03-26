using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.User;
using api.Interface;
using api.Model;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    
    public class UserAdminRepository : IUserAdminRepository
    {
         private readonly ApplicationDBContext _context;
     public UserAdminRepository(ApplicationDBContext context)
        {
            _context = context;
        }
         public async Task<int>CountNumberOfUsersWithTime(DateTime? startDate,DateTime? endDate)
         {
        return await _context.AppUsers
            .Where(u => u.CreatedAt >= startDate && u.CreatedAt <= endDate)
            .CountAsync();
    
         }
         public async Task<int>TotalOfUser()
         {
            return await _context.AppUsers.CountAsync();
         }

            public async Task<List<AppUser>> GetAllUsersAsync()
        {
            return await _context.AppUsers.ToListAsync();
        }

        public async Task<AppUser> GetUserByIdAsync(string userId)
        {
            return await _context.AppUsers.FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await _context.AppUsers.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return false;

            _context.AppUsers.Remove(user);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateUserByAdminAsync(string userId, UpdateUserDto updateUserDto)
        {
            var user = await _context.AppUsers.FindAsync(userId);
            if (user == null) return false;

            user.FullName = updateUserDto.FullName;
            user.Address = updateUserDto.Address;
            user.PhoneNumber = updateUserDto.PhoneNumber;
            user.DateOfBirth = updateUserDto.DateOfBirth;

            _context.AppUsers.Update(user);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}