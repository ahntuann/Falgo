using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interface;

namespace api.Services
{
    public class UserService : IUserService
    {
        private readonly IContestRegistationRepository _contestRegisRepo;
        private readonly IUserRepository _userRepo;
        private readonly IContestRepository _contestRepo;
        public UserService(IContestRegistationRepository contestRegisRepo, IUserRepository userRepo, IContestRepository contestRepo)
        {
            _contestRegisRepo = contestRegisRepo;
            _userRepo = userRepo;
            _contestRepo = contestRepo;
        }

        public async Task<bool?> IsUserRegisContest(string userId, string contestId)
        {
            var user = await _userRepo.GetUserByIdAsync(userId);
            var contest = await _contestRepo.GetContestByIdAsync(contestId);

            if (user == null || contest == null)
                return null;

            var contestRegis = await _contestRegisRepo.GetContestRegistionByUserAndContestAsync(user, contest);

            return contestRegis != null;
        }
    }
}