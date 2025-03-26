using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Helpers;
using api.Interface;
using api.Model;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class ContestRepository : IContestRepository
    {
        private readonly ApplicationDBContext _context;
        public ContestRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Contest?> GetContestByIdAsync(string id)
        {
            var contest = await _context.Contests.FirstOrDefaultAsync(x => x.ContestId == id);

            return contest;
        }

        public async Task<List<Contest>> GetContestsAsync(string typeOfContest)
        {
            List<Contest> contests = new List<Contest>();

            if (typeOfContest == "upcomming")
            {
                contests = await _context.Contests
                    .Where(x => x.EndDate > DateTime.Now)
                    .ToListAsync();
            }
            else if (typeOfContest == "over")
            {
                contests = await _context.Contests
                    .Where(x => x.EndDate <= DateTime.Now)
                    .ToListAsync();
            }

            return contests;
        }

        public async Task<List<Contest?>> GetXContestsNewestAsync(int pageSize)
        {
            var contests = await _context.Contests
                                .OrderByDescending(x => x.CreatedAt)
                                .Take(pageSize)
                                .ToListAsync();

            return contests;
        }
         public async Task<List<Contest?>> GetAllContestAsync(ContestManagementQueryObject query)
        {  
            var contests=  _context.Contests.AsQueryable();
             if (!string.IsNullOrWhiteSpace(query.ContestTitle))
            {
                var titleLower = query.ContestTitle.ToLower();
                contests = contests.Where(p => p.ContestName.ToLower().Contains(titleLower));
            }
           
          
            return await contests.ToListAsync();
        }
    }
}