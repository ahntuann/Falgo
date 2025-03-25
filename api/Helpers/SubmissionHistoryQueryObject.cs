using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Helpers
{
    public class SubmissionHistoryQueryObject
    {
        public string Status { get; set; } = string.Empty;
        public DateOnly? SelectedDate { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 15;
    }
}