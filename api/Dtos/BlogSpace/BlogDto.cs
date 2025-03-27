using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Model;


namespace api.Dtos.BlogSpace
{
    public class BlogDto
    {
        public int ID { get; set; }

        public string? UserId { get; set; }

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
        public List<BlogCommentDto> CommentBlog { get; set; } = new List<BlogCommentDto>();
        public List<BlogLikeDto> BlogLike { get; set; } = new List<BlogLikeDto>();
        public List<BlogShareDto> BlogShare { get; set; } = new List<BlogShareDto>();
        public List<BlogBookmarkDto> BlogBookmark { get; set; } = new List<BlogBookmarkDto>();
    }
}