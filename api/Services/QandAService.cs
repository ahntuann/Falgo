using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Contest;
using api.Helpers;
using api.Interface;
using api.Interface.Repository;
using api.Mappers;
using api.Model;
using api.Dtos.QandA;
namespace api.Services
{
    public class QandAService
    {
        private readonly IQandARepository _QandArepo;
        private readonly IUserRepository _UserRepo;
        public QandAService(IQandARepository QandArepo)
        {
            _QandArepo=QandArepo;
        }
        public async Task<PageResult<QuestionDto>> GetAllQuestion(QandAObjectQuery query)
        {
            var question = await _QandArepo.GetAllQuestion();
            int totalItems = question.Count;
            var result = question.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
                return new PageResult<QuestionDto>
            {
                Items = result,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize),
                CurrentPage = query.PageNumber
            };
        }
    }
}