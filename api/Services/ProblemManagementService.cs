using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Admin;
using api.Dtos.Problem;
using api.Helpers;
using api.Interface;
using api.Interface.Repository;
using api.Interface.Services;
using api.Mappers;
using api.Model;
using api.Repository;
using Google.Api.Gax;

namespace api.Services
{
    public class ProblemManagementService : IProblemManagementService
    {
        private readonly IProblemManagementRepository _ProblemRepo;
        private readonly ISubmissionRepository _submissionRepository;
        private readonly ITestCaseRepository _testcaseRepository;
        public ProblemManagementService(IProblemManagementRepository ProblemRepo,ISubmissionRepository submissionRepository,ITestCaseRepository testcaseRepository)
        {
            _ProblemRepo = ProblemRepo;
            _submissionRepository = submissionRepository;
            _testcaseRepository = testcaseRepository;
        }
        public async Task DeleteProblemAsync(string ProblemID)
        {
            await _ProblemRepo.DeleteProblemAsync(ProblemID);
        }
        
        public async Task<List<string>> GetAllCategoriesAsync()
        {
            var problems = await _ProblemRepo.GetAllProblemAsync();
            var categories = problems
                .Select(p => p.Category)
                .Where(c => !string.IsNullOrWhiteSpace(c)).Distinct()
                .ToList();
            return categories;
        }
        public async Task<PageResult<ViewProblemManagementDto>> ViewAllProblemtMangagement(ProblemManagamentQueryObject query)
        {
              var problemsQuery = await _ProblemRepo.GetFilteredProblemsAsync(query);
            var problemIds = problemsQuery.Select(p => p.ProblemId).ToList();
            var allSubmissions = await _submissionRepository.GetSubmissionsByProblemIdsAsync(problemIds);
            var submissionsLookup = allSubmissions.ToLookup(s => s.Problem.ProblemId);
            var problems = problemsQuery.Select(problem =>
            {
                var submissions = submissionsLookup[problem.ProblemId].ToList();
                return problem.ProblemManagementDto(submissions);
            }).ToList();
            int totalItems = problems.Count;
            var result = problems.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            Console.WriteLine("totalItems1:  "+query.ProblemTitle);
            return new PageResult<ViewProblemManagementDto>
            {
                Items = result,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize),
                CurrentPage = query.PageNumber
            };
        }
        public async Task AddProblemAsync (ProblemFormObject ProblemObject)
        {
           await _ProblemRepo.CreateProblemAsync(ProblemObject.Problem.ToProblemFromProblemDto());
           await _testcaseRepository.CreateTestCaseAsync(ProblemObject.testcase.ToTestcaseFromTestcaseDto(ProblemObject.Problem.ProblemId));
        }
         public async Task<object?> GetProblemDetailByIdAsync(string problemId)
        {
            var problem = await _ProblemRepo.GetProblemByIdAsync(problemId);
            if (problem == null)
            {
                return null;
            }
            return problem;
        }
        public async Task UpdateProblemAsync(ProblemDto problem)
        {
            await _ProblemRepo.UpdateProblemAsync( problem.ToProblemFromProblemDto());
        }
    }
}