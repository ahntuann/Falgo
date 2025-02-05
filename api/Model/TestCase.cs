using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Model
{
    public class TestCase
    {
        [Key]
        public string TestCaseId { get; set; } = string.Empty;
        [Required]
        public string ProblemId { get; set; } = string.Empty;
        [Required, MaxLength(100)]
        public string TestCaseName { get; set; } = string.Empty;
        [Required]
        public string Input { get; set; } = string.Empty;
        [Required]
        public string Output { get; set; } = string.Empty;
        public Problem Problem { get; set; } = new Problem();
    }
}