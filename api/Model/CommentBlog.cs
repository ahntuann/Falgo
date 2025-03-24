using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Model
{
    public class CommentBlog
    {
        public int ID { get; set; }
        public string? Avatar { get; set; }
        public string? GuestName { get; set; }
        public string content { get; set; } = string.Empty;
        public DateTime CreateOn { get; set; } = DateTime.Now;
        public string Status { get; set; } = string.Empty;
        public string? Note { get; set; }

        public int? BlogId { get; set; }
        public Blog? Blog { get; set; }

        public string? UserId { get; set; }
        public AppUser? User { get; set; }
    }
}