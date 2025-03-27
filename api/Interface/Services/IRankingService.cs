using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.User;
using api.Helpers;
using api.Model;

namespace api.Interface.Services
{
    public interface IRankingService
    {
        Task<PageResult<RankingDto>> GetRanking(RankingQueryObject query);
    }
}