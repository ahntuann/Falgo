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
namespace api.Interface.Services
{
    public interface IQandAService
    {
          public  Task<PageResult<QuestionDto>> GetAllQuestion(QandAObjectQuery query);
    }
}