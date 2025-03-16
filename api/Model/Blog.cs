using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Model;
using System.ComponentModel.DataAnnotations;


namespace api.Model
{
    public class Blog
    {
        public int ID { get; set; }

        public string? UserId { get; set; }
        public AppUser? User { get; set; }

        public string? GuestName { get; set; }
        public string? GuestEmail { get; set; }

        public string Thumbnail { get; set; } = string.Empty;
        public string title { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string ImageBlog { get; set; } = string.Empty;
        public string CategoryBlog { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;

        public DateTime CreateOn { get; set; } = DateTime.Now;
        public DateTime? DatePublic { get; set; }
        public string? Note { get; set; } = string.Empty;
        public List<CommentBlog> CommentBlog { get; set; } = new List<CommentBlog>();
        public List<BlogLike> BlogLike { get; set; } = new List<BlogLike>();
        public List<BlogShare> BlogShare { get; set; } = new List<BlogShare>();
   }
}