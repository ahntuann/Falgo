using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ProgramingLanguage;
using api.Model;

namespace api.Mappers
{
    public static class ProgramingLanguageMapper
    {
        public static ProgramingLanguageDto ToProLanguageDtoFromProLanguage(this ProgrammingLanguage programmingLanguage)
        {
            return new ProgramingLanguageDto
            {
                ProgrammingLanguageId = programmingLanguage.ProgrammingLanguageId,
                Language = programmingLanguage.Language
            };
        }
    }
}