using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Model;
namespace api.Dtos.Problem
{
    public class ProblemDetailDto
    {
        public string ProblemId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Detail { get; set; } = string.Empty;
        public string Input { get; set; } = string.Empty;
        public string Output { get; set; } = string.Empty;
        public int TotalPoint { get; set; } = 0;
        public int TimeLimit { get; set; }
        public int MemoryLimit { get; set; }
        public string? Author { get; set; }
        public string? Solution { get; set; }
    }
}