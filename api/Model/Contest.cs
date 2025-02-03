using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Model
{
    public class Contest
    {
        [Key]
        public string ContestId { get; set; } = string.Empty;
        [Required]
        [MaxLength(100)]
        public string ContestName { get; set; } = string.Empty;
        [Required]
        public DateTime DueTime { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [Required]
        public int TotalPoint { get; set; }
        [Required]
        public int Level { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        public ICollection<ContestProblem>? ContestProblems { get; set; }
    }
}