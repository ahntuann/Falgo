using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
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
        public async Task UpdateUserAsync(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
        public async Task<bool> UpdateUser(AppUser user)
    {
        _context.Users.Update(user);
        return await _context.SaveChangesAsync() > 0;
    }
    }
}