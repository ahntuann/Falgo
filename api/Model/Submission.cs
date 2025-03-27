using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Model
{
    public class Submission
    {
        [Key]
        public string SubmissionId { get; set; } = string.Empty;
        [Required]
        [Range(0, 100)]
        public int Point { get; set; }
        [Required]
        public string SourceCode { get; set; } = string.Empty;
        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = string.Empty;
        [Required]
        public double ExecuteTime { get; set; }
        [Required]
        public int MemoryUsed { get; set; }
        [Required]
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        [Required]
        public string ProblemId { get; set; }
        [ForeignKey("ProblemId")]
        public Problem Problem { get; set; }

        [Required]
        public string AppUserId { get; set; }
        [ForeignKey("AppUserId")]
        public AppUser AppUser { get; set; }

        [Required]
        public string ProgrammingLanguageId { get; set; }
        [ForeignKey("ProgrammingLanguageId")]
        public ProgrammingLanguage ProgrammingLanguage { get; set; }
        public ICollection<TestCaseStatus> TestCaseStatuses { get; set; } = new List<TestCaseStatus>();
    }
}
