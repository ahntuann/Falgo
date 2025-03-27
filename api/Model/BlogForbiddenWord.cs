using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Model
{
    public class BlogForbiddenWord
    {
        public int ID { get; set; }

        public string Word { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public string action { get; set; } = string.Empty;
    }
}