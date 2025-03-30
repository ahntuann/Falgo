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
        private readonly IContestRepository _contestRepo;
        public ProblemManagementService(IProblemManagementRepository ProblemRepo,ISubmissionRepository submissionRepository,ITestCaseRepository testcaseRepository,IContestRepository contestRepo)
        {
            _ProblemRepo = ProblemRepo;
            _submissionRepository = submissionRepository;
            _testcaseRepository = testcaseRepository;
            _contestRepo=contestRepo;
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
           // Console.WriteLine("totalItems1:  "+query.ProblemTitle);
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

            Problem problem = ProblemObject.Problem.ToProblemFromProblemDto();
           await _ProblemRepo.CreateProblemAsync(problem);
        
           await _testcaseRepository.CreateTestCaseAsync(ProblemObject.testcase.ToTestcaseFromTestcaseDto(problem.ProblemId));
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
        public async Task<PageResult<ViewProblemManagementDto>> GetAddedProblemAsync(ContestProblemQueryObject query)
        {
          var problems= await _ProblemRepo.GetAddedProblemAsync(query.ContestId);
          var problemIds = problems.Select(p => p.ProblemId).ToList();
            var allSubmissions = await _submissionRepository.GetSubmissionsByProblemIdsAsync(problemIds);
            var submissionsLookup = allSubmissions.ToLookup(s => s.Problem.ProblemId);
            var problem = problems.Select(problem =>
            {
                var submissions = submissionsLookup[problem.ProblemId].ToList();
                return problem.ProblemManagementDto(submissions);
            }).ToList();
            int totalItems = problem.Count;
            var result = problem.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            int totalPoint=0;
            foreach (var item in result)
            {
                totalPoint+=item.TotalPoint;
            }
            _contestRepo.UpdateTotalPoint(totalPoint,query.ContestId);
                return new PageResult<ViewProblemManagementDto>
            {
                Items = result,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize),
                CurrentPage = query.PageNumber
            };
        }
        public async Task<PageResult<ViewProblemManagementDto>> GetExistProblemAsync(ContestProblemQueryObject query)
        {
        var problems= await _ProblemRepo.GetExistProblemAsync(query);  
         var problemIds = problems.Select(p => p.ProblemId).ToList();
            var allSubmissions = await _submissionRepository.GetSubmissionsByProblemIdsAsync(problemIds);
            var submissionsLookup = allSubmissions.ToLookup(s => s.Problem.ProblemId);
            var problem = problems.Select(problem =>
            {
                var submissions = submissionsLookup[problem.ProblemId].ToList();
                return problem.ProblemManagementDto(submissions);
            }).ToList();
            int totalItems = problem.Count;
            var result = problem.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
                return new PageResult<ViewProblemManagementDto>
            {
                Items = result,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize),
                CurrentPage = query.PageNumber
            };
        }
         public async Task AddProblemToContest(string problemId,string contestId)
        {
           
            await _ProblemRepo.AddProblemToContest(problemId,contestId);

            
        }
        public async Task DeleteProblemFromContest(string problemId,string contestId)
        {
            await _ProblemRepo.DeleteProblemFromContest(problemId,contestId);
        }
    }
}