using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Helpers;
using api.Interface.Services;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RankingController : ControllerBase
    {
        private readonly IRankingService _rankingService;

        public RankingController(IRankingService rankingService)
        {
            _rankingService = rankingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMonthlyRanking([FromQuery] RankingQueryObject query)
        {
            var result = await _rankingService.GetRanking(query);
            if (!result.Items.Any() && string.IsNullOrEmpty(query.FullName))
            {
                switch (query.Type?.ToLower())
                {
                    case "monthly":
                        return Ok("Dữ liệu xếp hạng tháng này chưa có");
                    case "weekly":
                        return Ok("Dữ liệu xếp hạng tuần này chưa có");
                    case "yearly":
                        return Ok("Dữ liệu xếp hạng năm này chưa có");
                    case "quarterly":
                        return Ok("Dữ liệu xếp hạng quý này chưa có");
                    case "overall":
                        return Ok("Dữ liệu xếp hạng chưa có");
                }
            }
            return Ok(result);
        }
    }
}