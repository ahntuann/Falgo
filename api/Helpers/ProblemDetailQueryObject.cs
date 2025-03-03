using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Helpers
{
    public class ProblemDetailQueryObject
    {
        public string? ProblemId { get; set; }

        public bool? Solving { get; set; } = false;
    }
}