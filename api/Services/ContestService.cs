using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Contest;
using api.Helpers;
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

        public async Task<List<ContestBriefDto>> GetContestsAsync(string typeOfContest)
        {
            var contests = await _contestRepo.GetContestsAsync(typeOfContest);

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

        public async Task<List<ContestBriefDto?>> GetXNewestContestAsync(int pageSize)
        {
            var contests = await _contestRepo.GetXContestsNewestAsync(pageSize);

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
        public async Task<PageResult<ContestBriefDto>> GetxContestAsync(ContestManagementQueryObject query)
        {
            var contests = await _contestRepo.GetAllContestAsync(query);

            Dictionary<Contest, int> contestRegisCount = new Dictionary<Contest, int>();

            foreach (var contest in contests)
            {
                var registions = await _contestRegisService.GetAllContestRegistationAsync(contest);

                contestRegisCount.Add(contest, registions.Count);
            }
            int totalItems = contestRegisCount.Count;
            var result = contestRegisCount.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            // Console.WriteLine("totalItems1:  "+query.ProblemTitle);
            return new PageResult<ContestBriefDto>
            {
                Items = result.Select(x => x.Key.ToContestBriefFromContest(x.Value)).ToList(),
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize),
                CurrentPage = query.PageNumber
            };
        }
        public async Task deleteContest(string ContestId)
        {
            await _contestRepo.DeleteContestAsync(ContestId);
        }
        public async Task<Contest?> getContestById(string id)
        {
            return await _contestRepo.GetContestByIdAsync(id);
        }
        public async Task addContest(ContestDto contest)
        {
            await _contestRepo.addContest(contest.ToContestFromContestDto());
        }

        public async Task<List<Problem>> GetAllProblemOfContest(string contestId)
        {
            return await _contestRepo.GetAllProblemOfContest(contestId);
        }

        public async Task<List<AppUser>> GetAllUserOfContest(string contestId)
        {
            return await _contestRepo.GetAllUserOfContest(contestId);
        }
    }
}