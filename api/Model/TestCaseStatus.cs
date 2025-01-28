using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Model
{
    public class TestCaseStatus
    {
    [Key]
    public int TestCaseId { get; set; }
    public double ExecutionTime { get; set; } 
    [Required]
    public int MemoryUsage { get; set; } 
    [Required]
    [MaxLength(50)]
    public string Result { get; set; } = string.Empty; 
    public string Log { get; set; } = string.Empty; 
    public Submission Submission { get; set; } = new Submission();
    }
}