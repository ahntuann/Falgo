using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Problem;
using api.Helpers;
using api.Interface;
using api.Mappers;
using api.Model;

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

        public async Task<PageResult<ViewAllProblemDto>> GetAllProblemsWithStatsAsync(string userId, QueryObject query)
        {
            var problemsQuery = (await _problemRepository.GetAllProblemAsync()).AsQueryable();
            //Search theo title cua problem
            if (!string.IsNullOrWhiteSpace(query.ProblemTitle))
            {
                problemsQuery = problemsQuery.Where(p => p.Title.Contains(query.ProblemTitle, StringComparison.OrdinalIgnoreCase));
            }
            //Search theo category cua problem
            if (!string.IsNullOrWhiteSpace(query.ProblemCategory))
            {
                problemsQuery = problemsQuery.Where(p => p.Category.Equals(query.ProblemCategory, StringComparison.OrdinalIgnoreCase));
            }
            var problems = new List<ViewAllProblemDto>();
            foreach (var problem in problemsQuery)
            {
                var submissions = await _submissionRepository.GetSubmissionsByProblemIdAsync(problem.ProblemId);
                var problemDto = ProblemMapper.ToViewAllProblemDto(problem, submissions, userId);
                problems.Add(problemDto);
            }
            //Sorting
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
            var result = new List<ViewAllProblemDto>();
            //Tinh toan de phan trang
            int totalItems = problems.Count();
            //Lay ket qua problem tu db
            foreach (var problem in problems.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize))
            {
                //Filter loc problem da hoan thanh
                bool hidePassed = false;
                if (!string.IsNullOrWhiteSpace(query.HidePassed))
                {
                    bool.TryParse(query.HidePassed, out hidePassed);
                }
                if (hidePassed && problem.SolvedStatus.Equals("Passed"))
                {
                    continue;
                }
                result.Add(problem);
            }
            return new PageResult<ViewAllProblemDto>
            {
                Items = result,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize),
                CurrentPage = query.PageNumber
            };
        }
    }
}
