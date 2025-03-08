using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Helpers;
using api.Model;

namespace api.Interface.Repository
{
    public interface IProblemManagementRepository
    {
         public  Task<List<Problem>> GetAllProblemAsync();
          public  Task DeleteProblemAsync(string ProblemID);
          public  Task CreateProblemAsync(Problem NewProblem);
          public  Task<List<Problem>> GetFilteredProblemsAsync(ProblemManagamentQueryObject query);
          public  Task<Problem?> GetProblemByIdAsync(string problemId);
         public  Task UpdateProblemAsync(Problem problem);
    }
}