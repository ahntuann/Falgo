using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ProgramingLanguage;
using api.Interface;
using api.Mappers;

namespace api.Services
{
    public class ProgramingLanguageService : IProgramingLanguageService
    {

        private readonly IProgramingLanguageRepository _proLanguageRepo;
        public ProgramingLanguageService(IProgramingLanguageRepository proLanguageRepo)
        {
            _proLanguageRepo = proLanguageRepo;
        }

        public async Task<List<ProgramingLanguageDto>> GetAllProLanguageAsync()
        {
            var proLanguageDto = await _proLanguageRepo.GetAllProgramingLanguageAsync();

            return proLanguageDto
                    .Select(x => x.ToProLanguageDtoFromProLanguage())
                    .ToList();
        }

        public async Task<ProgramingLanguageDto?> GetProgramingLanguageAsync(string id)
        {
            var proLang = await _proLanguageRepo.GetProgrammingLanguageByIdAsync(id);

            if (proLang == null)
                return null;

            return proLang.ToProLanguageDtoFromProLanguage();
        }
    }
}