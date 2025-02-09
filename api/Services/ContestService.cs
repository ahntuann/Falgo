using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Contest;
using api.Interface;
using api.Mappers;
using api.Model;

namespace api.Services
{
    public class ContestService : IContestService
    {
        private readonly IContestRepository _contestRepo;
        private readonly IContestRegistationService _contestRegisService;
        public ContestService(IContestRepository contestRepo, IContestRegistationService contestRegisService)
        {
            _contestRepo = contestRepo;
            _contestRegisService = contestRegisService;
        }

        public async Task<List<ContestBriefDto?>> GetXNewestContestAsync(int pageSize)
        {
            var contests = await _contestRepo.GetXContestsNewest(pageSize);

            if (contests == null)
                return null;

            Dictionary<Contest, int> contestRegisCount = new Dictionary<Contest, int>();

            foreach (var contest in contests)
            {
                var registions = await _contestRegisService.GetAllContestRegistationAsync(contest);

                contestRegisCount.Add(contest, registions.Count);
            }

            return contestRegisCount.Select(x => x.Key.ToContestBriefFromContest(x.Value)).ToList();
        }
    }
}