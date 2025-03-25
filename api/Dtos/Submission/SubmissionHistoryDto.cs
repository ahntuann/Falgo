using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Submission
{
    public class SubmissionHistoryDto
    {
        public string ProblemTitle { get; set; } = string.Empty;
        public string SubmissionId { get; set; } = string.Empty;
        public int Point { get; set; }
        public string SourceCode { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public double ExecuteTime { get; set; }
        public int MemoryUsed { get; set; }
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        public string ProgrammingLanguage { get; set; }
    }
}