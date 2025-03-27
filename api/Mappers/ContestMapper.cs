using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Contest;
using api.Model;

namespace api.Mappers
{
    public static class ContestMapper
    {
        public static ContestBriefDto ToContestBriefFromContest(this Contest contest, int numRegis)
        {
            return new ContestBriefDto
            {
                ContestId = contest.ContestId,
                ContestName = contest.ContestName,
                DueTime = contest.DueTime,
                TotalPoint = contest.TotalPoint,
                Level = contest.Level,
                EndDate = contest.EndDate,
                Banner = contest.Banner,
                NumRegis = numRegis
            };
        }
        public static Contest ToContestFromContestDto(this ContestDto contest)
        {
            return new Contest
            {
                ContestId=contest.ContestId,
                ContestName = contest.ContestName,
                DueTime = contest.DueTime,
                TotalPoint = contest.TotalPoint,
                Level = contest.Level,
                EndDate = contest.EndDate,
                Banner = contest.Banner,
                CreatedAt =DateTime.Now,
            };
        }
    }
}