using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.ProblemHomePage
{
    public class ProblemHomePageDonedDto
    {

        public string ProblemId { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Detail { get; set; } = string.Empty;
        public int TotalPoint { get; set; } = 0;
        public int TimeLimit { get; set; }
        public int MemoryLimit { get; set; }
        public string? Author { get; set; }
        public string Status { get; set; } = "Accepted";

        public override bool Equals(object obj)
        {
            return obj is ProblemHomePageDonedDto dto &&
                   ProblemId == dto.ProblemId;
        }

        public override int GetHashCode()
        {
            return ProblemId.GetHashCode();
        }
    }
}