using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.User;
using api.Helpers;
using api.Interface;
using api.Interface.Repository;
using api.Interface.Services;
using api.Model;
using api.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace api.Services
{
    public class RankingService : IRankingService
    {
        private readonly IRankingRepository _repository;

        public RankingService(IRankingRepository rankingRepository)
        {
            _repository = rankingRepository;
        }

        public async Task<PageResult<RankingDto>> GetRanking(RankingQueryObject query)
        {
            IQueryable<RankingDto> rankingQuery = Enumerable.Empty<RankingDto>().AsQueryable();

            // Chọn loại ranking theo query.Type
            switch (query.Type?.ToLower())
            {
                case "monthly":
                    rankingQuery = _repository.GetMonthlyRanking();
                    break;
                case "weekly":
                    rankingQuery = _repository.GetWeeklyRanking();
                    break;
                case "yearly":
                    rankingQuery = _repository.GetYearlyRanking();
                    break;
                case "quaterly":
                    rankingQuery = _repository.GetQuarterlyRanking();
                    break;
                case "overall":
                    rankingQuery = _repository.GetOverallRanking();
                    break;
            }

            // Lấy danh sách từ DB
            var rankingList = await rankingQuery.ToListAsync();

            // Gán Rank trước khi phân trang
            var rankedList = rankingList
                .OrderByDescending(r => r.Score)
                .ThenByDescending(r => r.TotalProblem)
                .Select((r, index) => new RankingDto
                {
                    Rank = index + 1,
                    FullName = r.FullName,
                    Avatar = r.Avatar,
                    Score = r.Score,
                    TotalProblem = r.TotalProblem
                }).ToList();

            if (!string.IsNullOrEmpty(query.FullName))
            {
                rankedList = rankedList.Where(r => r.FullName.Contains(query.FullName)).ToList();
            }

            int totalItems = rankedList.Count;

            var rankings = rankedList
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToList();

            return new PageResult<RankingDto>
            {
                Items = rankings,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling((double)totalItems / query.PageSize),
                CurrentPage = query.PageNumber
            };
        }
    }
}