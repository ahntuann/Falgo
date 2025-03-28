using System;
using System.CodeDom;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.QandA;
using api.Model;

namespace api.Mappers
{
    public static class QnadAMapper
    {
        public static QuestionDto FromQuestionToQuestionDto (this Question question, string Username)
        {
            return new QuestionDto{
                UserName=Username,
                Content=question.Content,
                CreatedAt=question.CreatedAt,
                Category=question.Category,
            };
        }
    }
}