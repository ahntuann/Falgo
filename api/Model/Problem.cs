using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Model
{
    public class Problem
    {
        [Key]
        public string ProblemId { get; set; } = string.Empty;
        [Required, MaxLength(100)]
        public string Category { get; set; } = string.Empty;
        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        [Required]
        public string Detail { get; set; } = string.Empty;
        [Required]
        public string Input { get; set; } = string.Empty;
        [Required]
        public string Output { get; set; } = string.Empty;
        [Range(0, 100)]
        public int TotalPoint { get; set; } = 0;
        [Required]
        public int TimeLimit { get; set; }
        [Required]
        public int MemoryLimit { get; set; }
        [MaxLength(100)]
        public string? Author { get; set; }
        public string? Solution { get; set; }
        public ICollection<ContestProblem>? ContestProblems { get; set; }
    }
}