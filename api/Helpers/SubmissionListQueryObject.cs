using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Helpers
{
    public class SubmissionListQueryObject
    {
        public string? UserId { get; set; }
        public string? ProblemId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? ProgrammingLanguage { get; set; }
        public string SortBy { get; set; } = string.Empty;
        public string IsDescending { get; set; } = "false";
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 15;
    }
}