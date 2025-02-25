using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Submission;

namespace api.Interface
{
    public interface ISubmissionService
    {
        public Task<List<SubmissionSkillDto?>> GetAllSubmissionByUserAndProLanguageAsync(string userId, string proLang, bool isAccepted);
    }
}