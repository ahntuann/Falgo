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

        public static SubmissionListDto ToSubmissionListDto(this Submission submission)
        {
            return new SubmissionListDto
            {
                SubmitterName = submission.AppUser.FullName,
                ProgrammingLanguage = submission.ProgrammingLanguage.Language,
                ProblemTitle = submission.Problem.Title,
                Score = submission.Point,
                Status = submission.Status,
                ExecuteTime = submission.ExecuteTime,
                MemoryUsed = submission.MemoryUsed,
                SubmittedAt = submission.SubmittedAt,
                SourceCode = submission.SourceCode
            };
        }
    }
}