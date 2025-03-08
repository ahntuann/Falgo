using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Admin;
using Microsoft.Identity.Client;

namespace api.Helpers
{
    public class ProblemFormObject
    {
        public ProblemDto Problem { get; set; }
       public List<TestcaseDto> testcase { get; set; }
    }
}