using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Model;

namespace api.Interface
{
    public interface IUserRepository
    {
        public Task<AppUser?> GetUserByIdAsync(string id);
    }
}