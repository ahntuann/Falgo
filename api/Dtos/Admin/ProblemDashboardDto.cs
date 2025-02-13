using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Admin
{
    public class ProblemDashboardDto
    {
         public string ProblemId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public double Score { get; set; }
        public int NumberOfSubmissions { get; set; }
    }
}