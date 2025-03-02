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
    }
}