using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Model.BlogSpace
{
    public class Blog
    {
        public int ID { get; set; }

        public int? UserId { get; set; }
        public User? User { get; set; }

        public string? GuestName { get; set; }
        public string? GuestEmail { get; set; }

        public string Thumbnail { get; set; } = string.Empty;
        public string title { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public List<ImageBlog> ImageBlog { get; set; } = new List<ImageBlog>();
        public List<CategoryBlog> CategoryBlog { get; set; } = new List<CategoryBlog>();
        public string Status { get; set; } = string.Empty;

        public DateTime CreateOn { get; set; } = DateTime.Now;
        public DateTime? DatePublic { get; set; }
        public List<TagBlog> TagBlog { get; set; } = new List<TagBlog>();
        public List<CommentBlog> CommentBlog { get; set; } = new List<CommentBlog>();
    }
}