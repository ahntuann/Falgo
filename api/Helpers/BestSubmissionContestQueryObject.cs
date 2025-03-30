using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Helpers
{
    public class BestSubmissionContestQueryObject
    {
        [Required]
        public string ContestId { get; set; } = string.Empty;
        [Required]
        public string ProblemId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public bool isAll { get; set; } = false;
    }
}