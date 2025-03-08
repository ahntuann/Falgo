using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ProgramingLanguage;
using api.Model;

namespace api.Interface
{
    public interface IProgramingLanguageService
    {
        public Task<List<ProgramingLanguageDto>> GetAllProLanguageAsync();
        public Task<ProgramingLanguageDto?> GetProgramingLanguageAsync(string id);
    }
}