using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.User
{
    public class AvatarUpdateDto
    {
        public IFormFile Avatar { get; set; }
    }
}