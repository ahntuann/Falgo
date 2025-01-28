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
    public int SubmissionId { get; set; }
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
    public Problem Problem { get; set; } = new Problem();
    public User User { get; set; } = new User();
    }
}