using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Model;

namespace api.Interface
{
    public interface IProgramingLanguageRepository
    {
        public Task<List<ProgrammingLanguage>> GetAllProgramingLanguageAsync();
        public Task<ProgrammingLanguage?> GetProgrammingLanguageByIdAsync(string id);
        public Task<string> GetLanguageNameByIdAsync(string languageId);
    }
}