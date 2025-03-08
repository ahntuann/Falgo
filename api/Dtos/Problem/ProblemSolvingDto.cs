using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Model;
namespace api.Dtos.Problem
{
    public class ProblemSolvingDto
    {
        public string ProblemId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public int TimeLimit { get; set; }
    }
}