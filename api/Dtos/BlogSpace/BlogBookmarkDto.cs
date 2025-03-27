using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.BlogSpace
{
    public class BlogBookmarkDto
    {
        public int ID { get; set; }
        public int BlogID { get; set; }
        public string? UserID { get; set; } = string.Empty;
    }
}