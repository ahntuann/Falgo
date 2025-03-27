using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.QandA;
using api.Dtos.User;
using api.Interface.Repository;
using api.Model;
using Microsoft.EntityFrameworkCore;
namespace api.Repository
{
    public class QandARepository
    {
        private readonly ApplicationDBContext _context;

        public QandARepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task AddQuestion (Question question)
        {
            await _context.Questions.AddAsync(question);
            await _context.SaveChangesAsync();
        }
        public async Task AddAnswer(Answer answer)
        {
            await _context.Answers.AddAsync(answer);
            await _context.SaveChangesAsync();
        }
        public async Task<List<QuestionDto>> GetAllQuestion()
        {
             var questions = await _context.Questions
        .Include(q => q.User) // Ensure User data is loaded
        .Select(q => new QuestionDto
        {
            Content = q.Content,
            Category = q.Category,
            CreatedAt = q.CreatedAt,
            UserName = q.User.UserName // Fetch username from AppUser
        })
        .ToListAsync();

    return questions;
        }
        public async Task<List<Answer>> GetAllAnswerByQuestionId(string questionId)
        {
            var answer= await _context.Answers.Where(a => a.QuestionId==questionId).ToListAsync();
            return answer;
        }

    }
}