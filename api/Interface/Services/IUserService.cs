using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Interface
{
    public interface IUserService
    {
        public Task<bool?> IsUserRegisContest(string userId, string contestId);
    }
}