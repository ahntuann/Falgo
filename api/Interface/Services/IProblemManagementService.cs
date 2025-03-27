using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Admin;
using api.Dtos.Problem;
using api.Helpers;
using api.Model;

namespace api.Interface.Services
{
    public interface IProblemManagementService
    {
        public  Task DeleteProblemAsync(string ProblemID);
      
        public Task<List<string>> GetAllCategoriesAsync();
        public  Task<PageResult<ViewProblemManagementDto>> ViewAllProblemtMangagement(ProblemManagamentQueryObject query);
        public  Task AddProblemAsync (ProblemFormObject ProblemObject);
        public  Task<object?> GetProblemDetailByIdAsync(string problemId);
        public Task UpdateProblemAsync(ProblemDto problem);
        public  Task<PageResult<ViewProblemManagementDto>> GetExistProblemAsync(ContestProblemQueryObject query);
        public  Task<PageResult<ViewProblemManagementDto>> GetAddedProblemAsync(ContestProblemQueryObject query);
        public  Task AddProblemToContest(string problemId,string contestId);
       
        public  Task DeleteProblemFromContest(string problemId,string contestId);
         
    }
}