using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Submission;
using api.Model;

namespace api.Mappers
{
    public static class SubmisstionMapper
    {
        public static SubmissionSkillDto ToSubmissionSkillDtoFromSubmission(this Submission submission)
        {
            return new SubmissionSkillDto
            {
                Status = submission.Status,
                ProLanguage = submission.ProgrammingLanguage
            };
        }
    }
}