using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Submission;
using api.Helpers;
using api.Model;

namespace api.Interface
{
    public interface ISubmissionService
    {
        public Task<List<SubmissionSkillDto?>> GetAllSubmissionByUserAndProLanguageAsync(string userId, string proLang, bool isAccepted);
        public Task<PageResult<SubmissionListDto>> GetAllSubmissionByProblem(SubmissionListQueryObject query, string problemId);
        public Task<List<string>> GetAllSubmitterUsernameAsync(string problemId);
        public Task<List<string>> GetAllSubmissionStatusAsync(string problemId);
        public Task<List<string>> GetAllSubmissionLanguageAsync(string problemId);
        public Task<Submission> CreateASubmissionAsync(Submission submission);
        public Task<SubmissionContest> CreateASubmissionContestAsync(SubmissionContest submission);
        public Task<Submission> CreateUserSubmissionAsync(Submission submission);
        Task<List<string>> GetAllSubmissionLanguagesByUserAsync(string userId);
        Task<List<string>> GetAllSubmissionStatusesByUserAsync(string userId);
        Task<PageResult<SubmissionListDto>> GetUserSubmissionsWithProblemInfoAsync(string userId, SubmissionListQueryObject query);
        public Task<PageResult<SubmissionHistoryDto>> GetSubmissionHistory(string userId, string problemId, SubmissionHistoryQueryObject query);
        public Task<List<string>> GetAllSubmissionHistoryStatusesAsync(string userId, string problemId);
        Task<Submission> GetSubmissionByIdAsync(string submissionId);
        Task<SubmissionContest> GetBestSubmisisonContest(string userId, string contestI, string problemId);
    }
}