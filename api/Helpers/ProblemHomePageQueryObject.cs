using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Helpers
{
    public class ProblemHomePageQueryObject
    {
        // MostAttemped
        public bool MostAttemped { get; set; } = false;

        // Not Done
        public bool NotDone { get; set; } = false;

        // Done
        public bool Done { get; set; } = false;

        public string userId { get; set; } = string.Empty;
        public int PageSize { get; set; } = 5;
        public int PageNumber { get; set; } = 1;

    }
}