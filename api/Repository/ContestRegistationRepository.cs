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

        public async Task<ContestRegistion?> GetContestRegistionByUserAndContestAsync(AppUser appUser, Contest contest)
        {
            var contestRegis = await _context.ContestRegistions
                                                .FirstOrDefaultAsync(x => x.ContestId.Equals(contest.ContestId) && x.Id.Equals(appUser.Id));

            return contestRegis;
        }

        public async Task<ContestRegistion?> CreateContestRegistionAsync(Contest contest, AppUser appUser)
        {
            var contestRegis = await GetContestRegistionByUserAndContestAsync(appUser, contest);

            if (contestRegis == null)
            {
                var newContestRegis = new ContestRegistion
                {
                    AppUser = appUser,
                    Contest = contest,
                    Id = appUser.Id,
                    ContestId = contest.ContestId
                };

                await _context.AddAsync(newContestRegis);
                await _context.SaveChangesAsync();

                return newContestRegis;
            }

            return null;
        }

        public async Task<List<ContestRegistion?>> GetAllRegistationAsync(Contest contests)
        {
            var registations = await _context.ContestRegistions
                                        .Where(x => x.ContestId == contests.ContestId)
                                        .ToListAsync();

            return registations;
        }

        public async Task<List<Contest>> GetContestsByUserIdAsync(string userId)
        {
            return await _context.ContestRegistions
                .Where(cr => cr.AppUser.Id == userId)
                .Include(cr => cr.Contest)
                .Select(cr => cr.Contest)
                .ToListAsync();
        }

        public async Task StartContestForUserAsync(string userId, string contestId)
        {
            var regis = await _context.ContestRegistions
                .FirstOrDefaultAsync(x => x.ContestId == contestId && x.AppUserId == userId);

            if (regis == null)
                return;

            regis.IsStart = true;
            regis.StartAt = DateTime.Now;

            await _context.SaveChangesAsync();
        }
    }
}