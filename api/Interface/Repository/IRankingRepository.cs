using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.User;

namespace api.Interface.Repository
{
    public interface IRankingRepository
    {
        public IQueryable<RankingDto> GetOverallRanking();
        public IQueryable<RankingDto> GetYearlyRanking();
        public IQueryable<RankingDto> GetQuarterlyRanking();
        public IQueryable<RankingDto> GetMonthlyRanking();
        public IQueryable<RankingDto> GetWeeklyRanking();
    }
}