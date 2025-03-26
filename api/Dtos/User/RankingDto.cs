using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.User
{
    public class RankingDto
    {
        public int Rank { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public int Score { get; set; }
        public int TotalProblem { get; set; }
    }
}