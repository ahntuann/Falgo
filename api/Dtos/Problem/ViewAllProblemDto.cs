using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Problem
{
    public class ViewAllProblemDto
    {
        public string ProblemId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public double Score { get; set; }
        public double AcceptanceRate { get; set; }
        public int AcceptedCount { get; set; }
        public string SolvedStatus { get; set; } = string.Empty;
    }
}