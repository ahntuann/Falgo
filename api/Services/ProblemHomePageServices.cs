using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ProblemHomePage;
using api.Interface;
using api.Mappers;

namespace api.Services
{
    public class ProblemHomePageServices : IProblemHomePageServices
    {
        private readonly ISubmissionRepository _submissionRepo;
        public ProblemHomePageServices(ISubmissionRepository submissionRepo)
        {
            _submissionRepo = submissionRepo;
        }

        public async Task<List<ProblemHomePageNotDoneDto?>> GetXProblemAreNotDoneAsync(int pageSize, string userId, int month, int year)
        {
            var submissions = await _submissionRepo.GetAllSubmissionAtMonthAsync(month, year);

            if (submissions == null)
                return null;

            var problems = submissions
                                .Where(x => x.AppUser.Id.Equals(userId) && !x.Status.Equals("Accepted"))
                                .GroupBy(x => x.Problem.ToProblemHomePageNotDoneFromProblem((x.Point, x.Status)))
                                .Take(pageSize)
                                .Select(x => x.Key)
                                .ToList();

            return problems;
        }

        public async Task<List<ProblemHomePageDonedDto?>> GetXProblemDonedAsync(int pageSize, string userId, int month, int year)
        {
            var submissions = await _submissionRepo.GetAllSubmissionAtMonthAsync(month, year);

            if (submissions == null)
                return null;

            var problems = submissions
                            .Where(x => x.AppUser.Id == userId && x.Status.Equals("Accepted"))
                            .GroupBy(x => x.Problem.ToProblemHomePageDonedFromPoblem())
                            .Take(pageSize)
                            .Select(x => x.Key)
                            .ToList();

            return problems;
        }

        public async Task<List<ProblemHomePageMostAttempedDto?>> GetXProblemHomePageMostAttmpedAsync(int pageSize, int month, int year)
        {
            var submissions = await _submissionRepo.GetAllSubmissionAtMonthAsync(month, year);

            if (submissions == null)
                return null;

            var problemExistTime = submissions
                .GroupBy(x => x.Problem.ToProblemHomePageMostAttempedDtoFromProblem())
                .ToDictionary(
                    g => g.Key,
                    g => (
                        g.Count(),
                        g.Count(x => x.Status.Equals("Accepted"))
                    )
                );

            var topX = problemExistTime.OrderByDescending(x => x.Value).Take(pageSize).ToList();

            List<ProblemHomePageMostAttempedDto> problems = topX.Select(x => x.Key.AddNumAttempted(x.Value)).ToList();

            return problems;
        }
    }
}