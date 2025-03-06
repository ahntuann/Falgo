using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.TestCase
{
    public class TestCaseStatusDto
    {
        public string TestCaseId { get; set; } = string.Empty;
        public double ExecutionTime { get; set; }
        public double TimeLimit { get; set; }
        public string Result { get; set; } = string.Empty;
        public string Log { get; set; } = string.Empty;
        public string ActualOuput { get; set; } = string.Empty;
        public string Output { get; set; } = string.Empty;
        public string Input { get; set; } = string.Empty;
    }
}