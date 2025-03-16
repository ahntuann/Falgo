using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Submission
{
    public class SubmissionListDto
    {
        public string? SubmitterName { get; set; }
        public  string SubmissionId { get; set; }
        public string? ProgrammingLanguage { get; set; }
        public string? ProblemTitle { get; set; }
        public int Score { get; set; }
        public string? SourceCode { get; set; } = string.Empty;
        public string? Status { get; set; } = string.Empty;
        public double ExecuteTime { get; set; }
        public int MemoryUsed { get; set; }
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}