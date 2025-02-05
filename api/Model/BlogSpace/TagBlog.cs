using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Model.BlogSpace
{
    public class TagBlog
    {
        public int ID { get; set; }
        public string TagName { get; set; } = string.Empty;
        public int? BlogId { get; set; }
        public Blog? Blog { get; set; }
    }
}