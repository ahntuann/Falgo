using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Model;
using api.Helpers;
namespace api.Interface
{
    public interface IContestRepository
    {
        public Task<List<Contest?>> GetXContestsNewestAsync(int pageSize);
        public Task<Contest?> GetContestByIdAsync(string id);
        public Task<List<Contest>> GetContestsAsync(string typeOfContest);
        public  Task<List<Contest>> GetAllContestAsync(ContestManagementQueryObject query);
    }
}