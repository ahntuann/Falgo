using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Model;

namespace api.Dtos.Submission
{
    public class SubmissionSkillDto
    {
        public string Status { get; set; } = string.Empty;
        public ProgrammingLanguage ProLanguage { get; set; } = new ProgrammingLanguage();
    }
}