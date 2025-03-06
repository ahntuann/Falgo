using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Admin
{
    public class ProblemDto
    {
        public string ProblemId { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
     
        public string Detail { get; set; } = string.Empty;
       
        public string Input { get; set; } = string.Empty;
      
        public string Output { get; set; } = string.Empty;
     
        public string TotalPoint { get; set; } 
     
        public string TimeLimit { get; set; }
  
        public string MemoryLimit { get; set; }
        public string? Author { get; set; }
        public string? Solution { get; set; }
    }
}