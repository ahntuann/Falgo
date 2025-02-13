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
    public class SubmissionsAdminRepository : ISubmissionsAdminRepository
    {
         private readonly ApplicationDBContext _context;
         public SubmissionsAdminRepository(ApplicationDBContext context)
         {
             _context = context;
         }
         public async Task<int>CountNumberOfSubmissionsWithTime(DateTime? startDate,DateTime? endDate)
         {
        return await _context.Submissions
            .Where(u => u.SubmittedAt >= startDate && u.SubmittedAt <= endDate).CountAsync();
    
         }
         public async Task<int>TotalOfSubmissions()
         {
        return await _context.Submissions.CountAsync();
    
         }
    }
}