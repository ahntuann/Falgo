using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Problem;
using api.Helpers;
using api.Interface;
using api.Mappers;

namespace api.Services
{
    public class ProblemService : IProblemService
    {
        private readonly IProblemRepository _problemRepository;
        private readonly ISubmissionRepository _submissionRepository;
        public ProblemService(IProblemRepository problemRepository, ISubmissionRepository submissionRepository)
        {
            _problemRepository = problemRepository;
            _submissionRepository = submissionRepository;
        }

        public async Task<List<ViewAllProblemDto>> GetAllProblemsWithStatsAsync(string userId, QueryObject query)
        {
            var problems = await _problemRepository.GetAllProblemAsync();
            if (!string.IsNullOrWhiteSpace(query.Title))
            {
                problems = problems.Where(p => p.Title.Contains(query.Title, StringComparison.OrdinalIgnoreCase)).ToList();
            }
            var result = new List<ViewAllProblemDto>();

            foreach (var problem in problems)
            {
                var submissions = await _submissionRepository.GetSubmissionsByProblemIdAsync(problem.ProblemId);
                var problemDto = ProblemMapper.ToViewAllProblemDto(problem, submissions, userId);
                result.Add(problemDto);
            }

            return result;
        }
    }
}
