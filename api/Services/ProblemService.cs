using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Problem;
using api.Helpers;
using api.Interface;
using api.Mappers;
using api.Model;
using api.Repository;

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
        //Lay category de cho user select
        public async Task<List<string>> GetAllCategoriesAsync()
        {
            var problems = await _problemRepository.GetAllProblemAsync();
            var categories = problems
                .Select(p => p.Category)
                .Where(c => !string.IsNullOrWhiteSpace(c)).Distinct()
                .ToList();
            return categories;
        }

        public async Task<PageResult<ViewAllProblemDto>> GetAllProblemsWithStatsAsync(string userId, ProblemListQueryObject query)
        {
            var problemsQuery = await _problemRepository.GetFilteredProblemsAsync(query, userId);
            var problemIds = problemsQuery.Select(p => p.ProblemId).ToList();
            var allSubmissions = await _submissionRepository.GetSubmissionsByProblemIdsAsync(problemIds);
            //Toi uu voi duoi 1tr ban ghi toc do su ly 490milis/1 ban ghi
            var submissionsLookup = allSubmissions.ToLookup(s => s.Problem.ProblemId);
            var problems = problemsQuery.Select(problem =>
            {
                var submissions = submissionsLookup[problem.ProblemId].ToList();
                return problem.ToViewAllProblemDto(submissions, userId);
            }).ToList();
            if (!string.IsNullOrWhiteSpace(query.SortBy))
            {
                problems = query.SortBy switch
                {
                    "ar" => query.IsDescending.Equals("true") ? problems.OrderByDescending(p => p.AcceptanceRate).ToList()
                                                            : problems.OrderBy(p => p.AcceptanceRate).ToList(),
                    "ac" => query.IsDescending.Equals("true") ? problems.OrderByDescending(p => p.AcceptedCount).ToList()
                                                            : problems.OrderBy(p => p.AcceptedCount).ToList(),
                    "p" => query.IsDescending.Equals("true") ? problems.OrderByDescending(p => p.Score).ToList()
                                                            : problems.OrderBy(p => p.Score).ToList(),
                    _ => problems
                };
            }
            int totalItems = problems.Count;
            var result = problems.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();

            return new PageResult<ViewAllProblemDto>
            {
                Items = result,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize),
                CurrentPage = query.PageNumber
            };
        }

        public async Task<ProblemDetailDto?> GetProblemDetailByIdAsync(string problemId)
        {
            var problem = await _problemRepository.GetProblemByIdAsync(problemId);
            if (problem == null)
            {
                return null;
            }
            var problemDetail = problem.ToProblemDetailDto();
            return problemDetail;
        }

        public async Task<ProblemSolvingDto?> GetProblemSolvingByIdAsync(string problemId)
        {
            var problem = await _problemRepository.GetProblemByIdAsync(problemId);
            if (problem == null)
                return null;

            return problem.ToProblemSolvingDtoFromProblem();
        }
    }
}
