using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Admin;
namespace api.Interface
{
    public interface IProblemAdminService
    {
        public Task<List<ProblemDashboardDto?>> GetxProblemDashBoardMostAttemped(int topx,Boolean IsAsc);

    }
}