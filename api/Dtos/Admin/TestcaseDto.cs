using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Admin
{
    public class TestcaseDto
    {
        public string TestCaseName { get; set; } = string.Empty;
    
        public string Input { get; set; } = string.Empty;
        public string Output { get; set; } = string.Empty;

    }
}