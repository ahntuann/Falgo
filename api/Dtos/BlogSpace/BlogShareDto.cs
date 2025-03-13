using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.BlogSpace
{
    public class BlogShareDto
    {
        public int ID { get; set; }


        public int BlogID { get; set; }

        public string? UserID { get; set; }

        public required string SharedPlatform { get; set; }
        public DateTime SharedOn { get; set; } = DateTime.UtcNow;
    }
}