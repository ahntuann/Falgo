using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interface;
using api.Model;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class ProgramingLanguageRepository : IProgramingLanguageRepository
    {
        private readonly ApplicationDBContext _context;
        public ProgramingLanguageRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<ProgrammingLanguage>> GetAllProgramingLanguageAsync()
        {
            var proLanguages = await _context.ProgrammingLanguage.ToListAsync();

            return proLanguages;
        }

        public async Task<ProgrammingLanguage?> GetProgrammingLanguageByIdAsync(string id)
        {
            var proLang = await _context.ProgrammingLanguage
                                .AsNoTracking()
                                .FirstOrDefaultAsync(x => x.ProgrammingLanguageId == id);

            return proLang;
        }
    }
}