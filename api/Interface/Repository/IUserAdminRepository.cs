using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Interface
{
    public interface IUserAdminRepository
    {
        public Task<int>CountNumberOfUsersWithTime(DateTime? startDate,DateTime? endDate);
        public Task<int>TotalOfUser();
          
    }
}