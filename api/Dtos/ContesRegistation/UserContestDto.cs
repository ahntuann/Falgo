using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.ContesRegistation
{
    public class UserContestDto
    {
        public string ContestId { get; set; }
        public string ContestName { get; set; }
        public int DueTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime EndDate { get; set; }
        public string Level { get; set; }
        public int TotalPoint { get; set; }
        public bool IsCompleted => DateTime.UtcNow > EndDate;
    }
}