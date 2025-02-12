using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Admin
{
    public class DatetimeFilterDto
    {
        public DateTime? startDate { get; set; }
        public DateTime? endDate { get; set; }
    }
}