using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Model
{
    public class SubmissionContest
    {
        [Key]
        public string SubmissionContestId { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string ContestId { get; set; }

        [Required]
        public int Point { get; set; }

        [Required]
        public string SourceCode { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; }

        [Required]
        public double ExecuteTime { get; set; }

        [Required]
        public int MemoryUsed { get; set; }

        [Required]
        public DateTime SubmittedAt { get; set; }

        [Required]
        public string ProblemId { get; set; }

        [Required]
        public string AppUserId { get; set; }

        public string? ProgrammingLanguageId { get; set; }

        [ForeignKey("ContestId")]
        public virtual Contest Contest { get; set; }

        [ForeignKey("ProblemId")]
        public virtual Problem Problem { get; set; }

        [ForeignKey("AppUserId")]
        public virtual AppUser AppUser { get; set; }

        [ForeignKey("ProgrammingLanguageId")]
        public virtual ProgrammingLanguage? ProgrammingLanguage { get; set; }
    }
}