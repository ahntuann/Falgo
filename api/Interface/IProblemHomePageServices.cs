using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ProblemHomePage;

namespace api.Interface
{
    public interface IProblemHomePageServices
    {
        public Task<List<ProblemHomePageMostAttempedDto?>> GetXProblemHomePageMostAttmpedAsync(int pageSize, int month, int year);
        public Task<List<ProblemHomePageNotDoneDto?>> GetXProblemAreNotDoneAsync(int pageSize, string userId, int month, int year);
        public Task<List<ProblemHomePageDonedDto?>> GetXProblemDonedAsync(int pageSize, string userId, int month, int year);
    }
}