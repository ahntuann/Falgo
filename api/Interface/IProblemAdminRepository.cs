using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Admin;
using api.Model;
namespace api.Interface
{
    public interface IProblemAdminRepository
    {
     
        public Task<List<Problem?>>GetAllProblemAsync();
        public Task<int> TotalOfProblemsAsync();
    }
}