using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Helpers;
using api.Model;

namespace api.Interface
{
    public interface ISubmissionRepository
    {
        public Task<List<Submission>> GetSubmissionsByProblemIdAsync(string problemId);
        public Task<List<Submission>> GetSubmissionsByProblemIdsAsync(List<string> problemIds);
        public Task<List<Submission?>> GetAllSubmissionAtMonthAsync(int month, int year);
        public Task<List<Submission?>> GetAllSubmissionsAsync();
        public Task<List<Submission?>> GetAllSubmissionAcceptedByUserAndProLanguageAsync(string userId, string proLanguageId);
        public Task<List<Submission?>> GetAllSubmissionNotAcceptedByUserAndProLanguageAsync(string userId, string proLanguageId);
        public Task<List<Submission>> GetFilteredSubmissionsAsync(SubmissionListQueryObject query, string userId);
    }
}