using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Contest
{
    public class ContestBriefDto
    {
        public string ContestId { get; set; } = string.Empty;
        public string ContestName { get; set; } = string.Empty;
        public int DueTime { get; set; }
        public int TotalPoint { get; set; }
        public string Level { get; set; } = string.Empty;
        public DateTime EndDate { get; set; }
        public string Banner { get; set; } = string.Empty;
        public int NumRegis { get; set; }
    }
}