using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Contest;

namespace api.Interface
{
    public interface IContestService
    {
        public Task<List<ContestBriefDto?>> GetXNewestContestAsync(int pageSize);
    }
}