using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Admin
{
    public class ViewProblemManagementDto
    {
          public string ProblemId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int Score { get; set; }
        public double AcceptanceRate { get; set; }
        public int AcceptedCount { get; set; }
    }
}