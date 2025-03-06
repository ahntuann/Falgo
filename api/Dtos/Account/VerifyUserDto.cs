using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Account
{
    public class VerifyUserDto
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
    }
}