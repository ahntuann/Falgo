using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Helpers
{
    public class ContestManagementQueryObject
    {
         public string ContestTitle { get; set; } = string.Empty;
        public string ContestId { get; set; } = string.Empty;
         public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 15;
    }
}