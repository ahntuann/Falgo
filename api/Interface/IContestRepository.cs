using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Model;

namespace api.Interface
{
    public interface IContestRepository
    {
        public Task<List<Contest?>> GetXContestsNewest(int pageSize);
    }
}