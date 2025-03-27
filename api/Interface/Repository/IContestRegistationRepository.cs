using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Model;

namespace api.Interface
{
    public interface IContestRegistationRepository
    {
        public Task<List<ContestRegistion?>> GetAllRegistationAsync(Contest contests);
        public Task<ContestRegistion?> CreateContestRegistionAsync(Contest contest, AppUser appUser);
        public Task<ContestRegistion?> GetContestRegistionByUserAndContestAsync(AppUser appUser, Contest contest);
        Task<List<Contest>> GetContestsByUserIdAsync(string userId);
        public Task StartContestForUserAsync(string userId, string contestId);
    }
}