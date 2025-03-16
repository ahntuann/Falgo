using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Model
{
    public class BlogShare
    {
        public int ID { get; set; }

        public int BlogID { get; set; }
        public Blog? Blog { get; set; }

        public string? UserID { get; set; }
        public AppUser? User { get; set; }

        public required string SharedPlatform { get; set; }
        public DateTime SharedOn { get; set; } = DateTime.Now;

    }
}