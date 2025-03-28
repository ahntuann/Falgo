using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Helpers;
using api.Model;
using api.Dtos.QandA;
namespace api.Interface.Repository
{
    public interface IQandARepository
    {
         public  Task AddQuestion (Question question);
       
        public  Task AddAnswer(Answer answer);
        
         public  Task<List<QuestionDto>> GetAllQuestion();
       
        public  Task<List<Answer>> GetAllAnswerByQuestionId(string questionId);
        
    }
}