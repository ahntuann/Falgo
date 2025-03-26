using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Model
{
    public class TestCaseStatus
    {
        public string TestCaseId { get; set; } = string.Empty;
        public string SubmissionId { get; set; } = string.Empty;
        public double ExecutionTime { get; set; }
        [Required]
        public int MemoryUsage { get; set; } = 0;
        [Required]
        [MaxLength(50)]
        public string Result { get; set; } = string.Empty;
        public string Log { get; set; } = string.Empty;
        public Submission Submission { get; set; } = new Submission();
        public TestCase TestCase { get; set; } = new TestCase();
    }
}