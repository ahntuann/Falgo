using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Submission;
using api.Helpers;
using api.Interface;
using api.Mappers;
using api.Model;

namespace api.Services
{
    public class SubmissionService : ISubmissionService
    {
        private readonly ISubmissionRepository _subRepo;
        public SubmissionService(ISubmissionRepository subRepo)
        {
            _subRepo = subRepo;
        }
        public async Task<PageResult<SubmissionListDto>> GetAllSubmissionByProblem(SubmissionListQueryObject query, string userId)
        {
            var submissionQuery = await _subRepo.GetFilteredSubmissionsAsync(query, userId);
            var submissions = submissionQuery.Select(Submission =>
            {
                return Submission.ToSubmissionListDto();
            }).ToList();
            int totalItems = submissions.Count;
            var result = submissions
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToList();

            return new PageResult<SubmissionListDto>
            {
                Items = result,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize),
                CurrentPage = query.PageNumber
            };
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