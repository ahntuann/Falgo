using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Model.BlogSpace;

namespace api.Dtos
{
    public class CreateBlogRequestDto
    {
        public string? GuestName { get; set; }
        public string? GuestEmail { get; set; }

        public string Thumbnail { get; set; } = string.Empty;
        public string title { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;

        public DateTime CreateOn { get; set; } = DateTime.Now;
        public DateTime? DatePublic { get; set; }
    }
}