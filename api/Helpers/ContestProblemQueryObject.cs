using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Helpers
{
    public class ContestProblemQueryObject
    {
        public string ContestId { get; set; } = string.Empty;
        public string ProblemId { get; set; } = string.Empty;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 15;
    }
}