using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Helpers
{
    public class ContestQueryObject
    {
        public bool IsNewest { get; set; } = false;
        public int PageSize { get; set; }
    }
}