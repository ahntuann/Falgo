using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ProgramingLanguage;

namespace api.Interface
{
    public interface IProgramingLanguageService
    {
        public Task<List<ProgramingLanguageDto>> GetAllProLanguageAsync();
    }
}