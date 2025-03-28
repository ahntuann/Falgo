using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ContesRegistation;
using api.Dtos.ContestRegistation;
using api.Model;

namespace api.Interface
{
    public interface IContestRegistationService
    {
        public Task<List<ContestRegistationDto?>> GetAllContestRegistationAsync(Contest contest);
        public Task<bool?> CreateContestRegisAsync(string contestId, string userId);
        public Task StartContestForUserAsync(string userId, string contestId);
        public Task<ContestRegistion?> GetContestRegistionByUserIdAndContestIdAsync(string userId, string contestId);
    }
}