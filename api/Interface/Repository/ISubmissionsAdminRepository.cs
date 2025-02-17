using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Interface
{
    public interface ISubmissionsAdminRepository
    {
        public Task<int>CountNumberOfSubmissionsWithTime(DateTime? startDate,DateTime? endDate);
        public Task<int>TotalOfSubmissions();
    }
}