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

        public async Task<List<ProblemHomePageMostAttempedDto?>> GetXProblemHomePageMostAttmpedAsync(int pageSize, int month, int year)
        {
            var submissions = await _submissionRepo.GetAllSubmissionAtMonthAsync(month, year);

            if (submissions == null)
                return null;

            Dictionary<ProblemHomePageMostAttempedDto, int> problemExistTime = submissions
                                                        .GroupBy(x => x.Problem.ToProblemHomePageMostAttempedDtoFromProblem())
                                                        .ToDictionary(x => x.Key, x => x.Count());

            var topX = problemExistTime.OrderByDescending(x => x.Value).Take(pageSize).ToList();

            List<ProblemHomePageMostAttempedDto> problems = topX.Select(x => x.Key.AddNumAttempted(x.Value)).ToList();

            return problems;
        }
    }
}