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
    }
}