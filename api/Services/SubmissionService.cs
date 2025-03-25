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
        private readonly IUserRepository _userRepo;
        public SubmissionService(ISubmissionRepository subRepo, IUserRepository userRepo)
        {
            _subRepo = subRepo;
            _userRepo = userRepo;
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

        public async Task<List<string>> GetAllSubmitterUsernameAsync(string problemId)
        {
            var submissions = await _subRepo.GetSubmissionsByProblemIdAsync(problemId);
            var usernames = submissions
                .Select(p => p.AppUser.FullName)
                .Where(c => !string.IsNullOrWhiteSpace(c)).Distinct()
                .ToList();
            return usernames;
        }
        public async Task<List<string>> GetAllSubmissionStatusAsync(string problemId)
        {
            var submissions = await _subRepo.GetSubmissionsByProblemIdAsync(problemId);
            var status = submissions
                .Select(p => p.Status)
                .Where(c => !string.IsNullOrWhiteSpace(c)).Distinct()
                .ToList();
            return status;
        }
        public async Task<List<string>> GetAllSubmissionLanguageAsync(string problemId)
        {
            var submissions = await _subRepo.GetSubmissionsByProblemIdAsync(problemId);
            var languages = submissions
                .Select(p => p.ProgrammingLanguage.Language)
                .Where(c => !string.IsNullOrWhiteSpace(c)).Distinct()
                .ToList();
            return languages;
        }

        public async Task<Submission> CreateASubmissionAsync(Submission submission)
        {
            return await _subRepo.CreateASubmissionAsync(submission);
        }

        public async Task<Submission> CreateUserSubmissionAsync(Submission submission)
        {
            var newSubmission = await _subRepo.CreateASubmissionAsync(submission);

            await UpdateUserStatisticsAsync(submission);

            return newSubmission;
        }

        private async Task UpdateUserStatisticsAsync(Submission submission)
        {
            var user = await _userRepo.GetUserByIdAsync(submission.AppUserId);
            if (user != null)
            {
                user.TotalSubmissions++;

                if (submission.Status == "Accepted")
                {
                    bool alreadySolved = await _subRepo.HasUserSolvedProblemAsync(
                        submission.AppUserId,
                        submission.ProblemId);

                    if (!alreadySolved)
                    {
                        user.TotalSolved++;
                        user.LastSolvedAt = DateTime.UtcNow;
                    }
                }
                await _userRepo.UpdateUserAsync(user);
            }
        }

        public async Task<List<string>> GetAllSubmissionLanguagesByUserAsync(string userId)
        {
            var query = new SubmissionListQueryObject { UserId = userId };
            var submissions = await _subRepo.GetFilteredSubmissionsAsync(query, userId);
            return submissions
                .Select(s => s.ProgrammingLanguage.Language)
                .Distinct()
                .ToList();
        }

        public async Task<List<string>> GetAllSubmissionStatusesByUserAsync(string userId)
        {
            var query = new SubmissionListQueryObject { UserId = userId };
            var submissions = await _subRepo.GetFilteredSubmissionsAsync(query, userId);
            return submissions
                .Select(s => s.Status)
                .Distinct()
                .ToList();
        }

        public async Task<PageResult<SubmissionListDto>> GetUserSubmissionsWithProblemInfoAsync(string userId, SubmissionListQueryObject query)
        {
            var submissionQuery = await _subRepo.GetFilteredSubmissionsAsync(query, userId);

            var submissions = submissionQuery.Select(submission => new SubmissionListDto
            {
                SubmissionId = submission.SubmissionId,
                ProblemTitle = submission.Problem.Title,
                Status = submission.Status,
                Score = submission.Point,
                ProgrammingLanguage = submission.ProgrammingLanguage.Language,
                ExecuteTime = submission.ExecuteTime,
                MemoryUsed = submission.MemoryUsed,
                SubmittedAt = submission.SubmittedAt,
                SubmitterName = submission.AppUser.FullName
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

        public async Task<PageResult<SubmissionHistoryDto>> GetSubmissionHistory(string userId, string problemId, SubmissionHistoryQueryObject query)
        {
            var submissionQuery = await _subRepo.GetSubmissionsHistory(userId, problemId, query);
            var submissions = submissionQuery.Select(Submission =>
            {
                return Submission.ToSubmissionHistoryDto();
            }).ToList();
            int totalItems = submissions.Count;
            var result = submissions
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToList();
            return new PageResult<SubmissionHistoryDto>
            {
                Items = result,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize),
                CurrentPage = query.PageNumber
            };
        }
    }
}