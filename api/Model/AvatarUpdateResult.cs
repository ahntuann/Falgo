using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Model
{
    public class AvatarUpdateResult
    {
        public bool Success { get; set; }
        public string AvatarUrl { get; set; }
    }
}