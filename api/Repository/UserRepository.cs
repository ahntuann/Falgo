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
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDBContext _context;
        public UserRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<AppUser?> GetUserByIdAsync(string id)
        {
            var user = await _context.AppUsers.FirstOrDefaultAsync(x => x.Id.Equals(id));

            return user;
        }

        public async Task<int> GetUserSolvedCountAsync(string userId)
        {
            return await _context.Submissions
        .Where(s => s.AppUserId == userId && s.Status == "Accepted")
        .Select(s => s.ProblemId)
        .Distinct()
        .CountAsync();
        }

        public async Task<int> GetUserSubmissionCountAsync(string userId)
        {
            return await _context.Submissions
            .Where(s => s.AppUserId == userId)
            .CountAsync();
        }
        public async Task<bool> UpdateUserAsync(string userId, UpdateUserDto updateUserDto)
        {
            var user = await _context.AppUsers.FirstOrDefaultAsync(x => x.Id.Equals(userId));
            
            if (user == null)
                return false;
                
            if (!string.IsNullOrEmpty(updateUserDto.FullName))
                user.FullName = updateUserDto.FullName;
                
            if (!string.IsNullOrEmpty(updateUserDto.UserName))
                user.UserName = updateUserDto.UserName;
                
            if (!string.IsNullOrEmpty(updateUserDto.Address))
                user.Address = updateUserDto.Address;
                
            if (!string.IsNullOrEmpty(updateUserDto.Avatar))
                user.Avatar = updateUserDto.Avatar;
                
            if (updateUserDto.DateOfBirth.HasValue)
                user.DateOfBirth = updateUserDto.DateOfBirth;
                
            if (!string.IsNullOrEmpty(updateUserDto.PhoneNumber))
                user.PhoneNumber = updateUserDto.PhoneNumber;
                
            if (!string.IsNullOrEmpty(updateUserDto.Email))
                user.Email = updateUserDto.Email;
                
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public async Task<bool> UpdateUser(AppUser user)
        {
            _context.AppUsers.Update(user);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task UpdateUserAsync(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

       
    }
}