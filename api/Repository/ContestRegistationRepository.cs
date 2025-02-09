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
    public class ContestRegistationRepository : IContestRegistationRepository
    {
        private readonly ApplicationDBContext _context;
        public ContestRegistationRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<ContestRegistion?>> GetAllRegistationAsync(Contest contests)
        {
            var registations = await _context.ContestRegistions
                                        .Where(x => x.ContestId == contests.ContestId)
                                        .ToListAsync();

            return registations;
        }
    }
}