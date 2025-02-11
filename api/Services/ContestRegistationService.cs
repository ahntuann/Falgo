using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ContesRegistation;
using api.Dtos.ContestRegistation;
using api.Interface;
using api.Mappers;
using api.Model;

namespace api.Services
{
    public class ContestRegistationService : IContestRegistationService
    {
        private readonly IContestRegistationRepository _contestRegisRepo;
        private readonly IContestRepository _contestRepo;
        private readonly IUserRepository _userRepo;
        public ContestRegistationService(IContestRegistationRepository contestRegisRepo, IContestRepository contestRepo, IUserRepository userRepo)
        {
            _contestRegisRepo = contestRegisRepo;
            _contestRepo = contestRepo;
            _userRepo = userRepo;
        }

        public async Task<bool?> CreateContestRegisAsync(string contestId, string userId)
        {
            var contest = await _contestRepo.GetContestByIdAsync(contestId);
            var user = await _userRepo.GetUserByIdAsync(userId);

            if (contest == null || user == null)
                return null;

            var contestRegis = await _contestRegisRepo.CreateContestRegistionAsync(contest, user);

            return !(contestRegis == null);
        }

        public async Task<List<ContestRegistationDto?>> GetAllContestRegistationAsync(Contest contest)
        {
            var contestRegistions = await _contestRegisRepo.GetAllRegistationAsync(contest);

            return contestRegistions
                    .Select(x => x.ToContestRegistationDtoFromContestRegistation())
                    .ToList();
        }
    }
}