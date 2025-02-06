using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        [MaxLength(50)]
        public string Language { get; set; } = string.Empty;
        [Required]
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        [Required]
        public Problem Problem { get; set; } = new Problem();
        public AppUser AppUser { get; set; } = new AppUser();
    }
}