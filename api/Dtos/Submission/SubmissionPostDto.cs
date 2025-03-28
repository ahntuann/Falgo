using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Model
{
    public class SubmissionPostDto
    {
        [Required]
        public string SourceCode { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        [Required]
        public string ProblemID { get; set; } = string.Empty;
        [Required]
        public string UserId { get; set; } = string.Empty;
        [Required]
        public string ProgrammingLanguageId { get; set; } = string.Empty;
        [Required]
        public bool IsTestCode { get; set; } = true;
        public string ContestId { get; set; } = string.Empty;
    }
}
