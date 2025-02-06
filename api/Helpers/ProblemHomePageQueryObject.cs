using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Helpers
{
    public class ProblemHomePageQueryObject
    {
        public bool MostAttemped { get; set; } = false;
        public int PageSize { get; set; } = 5;
        public int PageNumber { get; set; } = 1;
    }
}