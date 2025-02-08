using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Helpers
{
    public class QueryObject
    {
        public string ProblemTitle { get; set; } = string.Empty;
        public string ProblemCategory { get; set; } = string.Empty;
        public string HidePassed { get; set; } = string.Empty;
        public string SortBy { get; set; } = string.Empty;
        public string IsDescending { get; set; } = "false";
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 15;
    }
}