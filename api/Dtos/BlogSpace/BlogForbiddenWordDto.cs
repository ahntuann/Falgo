using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.BlogSpace
{
    public class BlogForbiddenWordDto
    {
        public int ID { get; set; }
        public string Word { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public string action { get; set; } = string.Empty;
    }
}