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
    }
}