using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Submission;
using api.Interface;
using api.Mappers;

namespace api.Services
{
    public class SubmissionService : ISubmissionService
    {
        private readonly ISubmissionRepository _subRepo;
        public SubmissionService(ISubmissionRepository subRepo)
        {
            _subRepo = subRepo;
        }

        public async Task<List<SubmissionSkillDto?>> GetAllSubmissionByUserAndProLanguageAsync(string userId, string proLang, bool isAccepted)
        {
            if (isAccepted)
            {
                var submissionsAc = await _subRepo.GetAllSubmissionAcceptedByUserAndProLanguageAsync(userId, proLang);

                return (submissionsAc == null) ? null : submissionsAc
                                                            .Select(x => x.ToSubmissionSkillDtoFromSubmission())
                                                            .ToList();
            }

            var submissionNotAc = await _subRepo.GetAllSubmissionNotAcceptedByUserAndProLanguageAsync(userId, proLang);

            return (submissionNotAc == null) ? null : submissionNotAc
                                                        .Select(x => x.ToSubmissionSkillDtoFromSubmission())
                                                        .ToList();
        }
    }
}