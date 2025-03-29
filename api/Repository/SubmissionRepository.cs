using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Helpers;
using api.Interface;
using api.Model;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class SubmissionRepository : ISubmissionRepository
    {
        private readonly ApplicationDBContext _context;

        public SubmissionRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<List<Submission>> GetAllSubmissionAtMonthAsync(int month, int year)
        {
            return await _context.Submissions.Where(x => x.SubmittedAt.Year == year && x.SubmittedAt.Month == month).Include(x => x.Problem).Include(x => x.AppUser).ToListAsync();
        }

        public async Task<List<Submission?>> GetAllSubmissionAcceptedByUserAndProLanguageAsync(string userId, string proLanguageId)
        {
            var submissions = await _context.Submissions
                                    .Where(x => x.AppUser.Id.Equals(userId)
                                                && x.ProgrammingLanguage.ProgrammingLanguageId.Equals(proLanguageId)
                                                && x.Status.Equals("Accepted"))
                                    .Include(x => x.ProgrammingLanguage)
                                    .ToListAsync();

            return submissions;
        }

        public async Task<List<Submission?>> GetAllSubmissionNotAcceptedByUserAndProLanguageAsync(string userId, string proLanguageId)
        {
            var submissions = await _context.Submissions
                                    .Where(x => x.AppUser.Id.Equals(userId)
                                                && x.ProgrammingLanguage.ProgrammingLanguageId.Equals(proLanguageId)
                                                && !x.Status.Equals("Accepted"))
                                    .Include(x => x.ProgrammingLanguage)
                                    .ToListAsync();

            return submissions;
        }

        public async Task<List<Submission>> GetSubmissionsByProblemIdAsync(string problemId)
        {
            return await _context.Submissions
                        .Include(s => s.AppUser).Include(s => s.ProgrammingLanguage)
                        .Where(s => s.Problem.ProblemId == problemId)
                        .ToListAsync();
        }
        public async Task<List<Submission>> GetSubmissionsByProblemIdsAsync(List<string> problemIds)
        {
            return await _context.Submissions.Include(s => s.AppUser)
                .Where(s => problemIds.Contains(s.Problem.ProblemId))
                .ToListAsync();
        }
        public async Task<List<Submission>> GetAllSubmissionsAsync()
        {
            return await _context.Submissions.ToListAsync();
        }

        public async Task<List<Submission>> GetFilteredSubmissionsAsync(SubmissionListQueryObject query, string userId)
        {
            var submissionQuery = _context.Submissions.Include(s => s.AppUser).Include(s => s.Problem).Include(s => s.ProgrammingLanguage).OrderByDescending(s => s.SubmittedAt).OrderByDescending(s => s.Point).AsQueryable();
            if (!string.IsNullOrWhiteSpace(query.ProblemId))
            {
                submissionQuery = submissionQuery.Where(s => s.Problem.ProblemId == query.ProblemId);
            }
            if (!string.IsNullOrWhiteSpace(query.UserName))
            {
                submissionQuery = submissionQuery.Where(s => s.AppUser.FullName.Equals(query.UserName));
            }
            if (!string.IsNullOrWhiteSpace(query.ProgrammingLanguage))
            {
                submissionQuery = submissionQuery.Where(s => s.ProgrammingLanguage.Language == query.ProgrammingLanguage);
            }
            if (!string.IsNullOrWhiteSpace(query.Status))
            {
                submissionQuery = submissionQuery.Where(s => s.Status == query.Status);
            }
            if (!string.IsNullOrWhiteSpace(query.UserId))
            {
                submissionQuery = submissionQuery.Where(s => s.AppUser.Id == userId);
            }
            return await submissionQuery.ToListAsync();
        }

        public async Task<Submission> CreateASubmissionAsync(Submission submission)
        {
            if (submission == null)
                throw new ArgumentNullException(nameof(submission));

            try
            {
                submission.SubmissionId = Guid.NewGuid().ToString();
                if (submission.ProgrammingLanguage != null)
                {
                    _context.Entry(submission.ProgrammingLanguage).State = EntityState.Unchanged;
                }
                if (submission.Problem != null)
                {
                    _context.Entry(submission.Problem).State = EntityState.Unchanged;
                }
                if (submission.AppUser != null)
                {
                    _context.Entry(submission.AppUser).State = EntityState.Unchanged;
                }

                await _context.Submissions.AddAsync(submission);

                await _context.SaveChangesAsync();

                return submission;
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex);
                return null;
            }
        }
        public async Task<bool> HasUserSolvedProblemAsync(string userId, string problemId)
        {
            return await _context.Submissions
            .AnyAsync(s => s.AppUserId == userId
                     && s.ProblemId == problemId
                     && s.Status == "Accepted");
        }

        public async Task<List<Submission?>> GetSubmissionsHistory(string userId, string problemId, SubmissionHistoryQueryObject query)
        {
            var submissionQuery = _context.Submissions.Include(s => s.ProgrammingLanguage).Include(s => s.Problem).Where(s => s.AppUserId == userId && s.ProblemId == problemId).AsQueryable();
            if (query.SelectedDate.HasValue)
            {
                var selectedDate = query.SelectedDate.Value.ToDateTime(TimeOnly.MinValue);
                submissionQuery = submissionQuery.Where(s => s.SubmittedAt.Date == selectedDate.Date);
            }
            if (!string.IsNullOrEmpty(query.Status))
            {
                submissionQuery = submissionQuery.Where(s => s.Status.Equals(query.Status));
            }
            return await submissionQuery.ToListAsync();
        }

        public async Task<Submission> GetSubmissionByIdAsync(string submissionId)
        {
            return await _context.Submissions.FirstOrDefaultAsync(x => x.SubmissionId == submissionId);
        }

        public async Task<SubmissionContest> CreateASubmissionContestAsync(SubmissionContest submission)
        {
            if (submission == null)
                throw new ArgumentNullException(nameof(submission));

            try
            {
                submission.SubmissionContestId = Guid.NewGuid().ToString();
                if (submission.ProgrammingLanguage != null)
                {
                    _context.Entry(submission.ProgrammingLanguage).State = EntityState.Unchanged;
                }
                if (submission.Problem != null)
                {
                    _context.Entry(submission.Problem).State = EntityState.Unchanged;
                }
                if (submission.AppUser != null)
                {
                    _context.Entry(submission.AppUser).State = EntityState.Unchanged;
                }

                await _context.SubmissionContest.AddAsync(submission);

                await _context.SaveChangesAsync();

                return submission;
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex);
                return null;
            }
        }

        public async Task<SubmissionContest> GetBestSubmisisonContest(string userId, string contestId, string problemId)
        {
            var submission = await _context.SubmissionContest
                .Where(x => x.AppUserId == userId && x.ContestId == contestId && x.ProblemId == problemId)
                .OrderByDescending(x => x.Point)
                .ThenByDescending(x => x.SubmittedAt)
                .FirstOrDefaultAsync();

            return submission;
        }
    }
}