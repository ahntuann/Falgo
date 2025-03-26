using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.User;
using api.Interface.Repository;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class RankingRepository : IRankingRepository
    {
        private readonly ApplicationDBContext _context;

        public RankingRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public IQueryable<RankingDto> GetMonthlyRanking()
        {
            var startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);
            return GetRankingQuery(startOfMonth, endOfMonth);
        }

        public IQueryable<RankingDto> GetWeeklyRanking()
        {
            var startOfWeek = DateTime.UtcNow.AddDays(-(int)DateTime.UtcNow.DayOfWeek);
            var endOfWeek = startOfWeek.AddDays(6);
            return GetRankingQuery(startOfWeek, endOfWeek);
        }

        public IQueryable<RankingDto> GetQuarterlyRanking()
        {
            int currentQuarter = (DateTime.UtcNow.Month - 1) / 3 + 1;
            var startOfQuarter = new DateTime(DateTime.UtcNow.Year, (currentQuarter - 1) * 3 + 1, 1);
            var endOfQuarter = startOfQuarter.AddMonths(3).AddDays(-1);
            return GetRankingQuery(startOfQuarter, endOfQuarter);
        }

        public IQueryable<RankingDto> GetYearlyRanking()
        {
            var startOfYear = new DateTime(DateTime.UtcNow.Year, 1, 1);
            var endOfYear = new DateTime(DateTime.UtcNow.Year, 12, 31);
            return GetRankingQuery(startOfYear, endOfYear);
        }

        public IQueryable<RankingDto> GetOverallRanking()
        {
            return GetRankingQuery(null, null);
        }

        private IQueryable<RankingDto> GetRankingQuery(DateTime? startDate, DateTime? endDate)
        {
            var query = _context.Submissions.Include(s => s.AppUser).Where(s => s.Status == "Accepted");

            if (startDate.HasValue && endDate.HasValue)
            {
                query = query.Where(s => s.SubmittedAt >= startDate && s.SubmittedAt <= endDate);
            }

            return query
                .GroupBy(s => new { s.AppUserId, s.ProblemId })
                .Select(g => new
                {
                    AppUserId = g.Key.AppUserId,
                    Avatar = g.First().AppUser.Avatar,
                    FullName = g.First().AppUser.FullName,
                    BestScore = g.Max(s => s.Point)
                })
                .GroupBy(g => new { g.AppUserId, g.FullName, g.Avatar })
                .Select(g => new RankingDto
                {
                    AppUserId = g.Key.AppUserId,
                    FullName = g.Key.FullName,
                    Avatar = g.Key.Avatar,
                    Score = g.Sum(x => x.BestScore),
                    TotalProblem = g.Count()
                })
                .OrderByDescending(r => r.Score)
                .ThenByDescending(r => r.TotalProblem);
        }
    }
}