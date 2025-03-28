using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Contest;
using api.Model;
using api.Helpers;
namespace api.Interface
{
    public interface IContestService
    {
        public Task<List<ContestBriefDto?>> GetXNewestContestAsync(int pageSize);
        public Task<List<ContestBriefDto>> GetContestsAsync(string typeOfContest);
        public Task<PageResult<ContestBriefDto>> GetxContestAsync(ContestManagementQueryObject query);
        public Task deleteContest(string ContestId);
        public Task<Contest?> getContestById(string id);
        public Task addContest(ContestDto contest);
        public Task<List<Problem>> GetAllProblemOfContest(string contestId);
    }
}