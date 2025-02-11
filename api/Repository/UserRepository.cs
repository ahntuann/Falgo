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
    }
}