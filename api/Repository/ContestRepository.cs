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
    public class ContestRepository : IContestRepository
    {
        private readonly ApplicationDBContext _context;
        public ContestRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<Contest?>> GetXContestsNewest(int pageSize)
        {
            var contests = await _context.Contests
                                .OrderByDescending(x => x.CreatedAt)
                                .Take(pageSize)
                                .ToListAsync();

            return contests;
        }
    }
}