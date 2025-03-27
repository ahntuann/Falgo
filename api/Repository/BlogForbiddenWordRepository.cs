using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.BlogSpace;
using api.Interface.Repository;
using api.Model;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class BlogForbiddenWordRepository : IBlogForbiddenWordRepository
    {
        private readonly ApplicationDBContext _Context;
        public BlogForbiddenWordRepository(ApplicationDBContext Context)
        {
            _Context = Context;
        }

        public async Task<List<BlogForbiddenWord>> GetAllAsync()
        {
            return await _Context.BlogForbiddenWord.ToListAsync();
        }

        public async Task<BlogForbiddenWord?> GetByIDAsync(int id)
        {
            return await _Context.BlogForbiddenWord.FirstOrDefaultAsync(i => i.ID == id);
        }

        public async Task<BlogForbiddenWord> CreateAsync(BlogForbiddenWord BlogModel)
        {
            await _Context.BlogForbiddenWord.AddAsync(BlogModel);
            await _Context.SaveChangesAsync();
            return BlogModel;
        }

        public async Task<BlogForbiddenWord?> UpdateAync(int id, CreateUpdateBlogForbiddenWordRequestDto Dto)
        {
            var existingBlogForbiddenWord = await _Context.BlogForbiddenWord.FirstOrDefaultAsync(x => x.ID == id);
            if (existingBlogForbiddenWord == null)
            {
                return null;
            }

            existingBlogForbiddenWord.Word = Dto.Word;
            existingBlogForbiddenWord.IsActive = Dto.IsActive;
            existingBlogForbiddenWord.action = Dto.action;


            await _Context.SaveChangesAsync();

            return existingBlogForbiddenWord;
        }

        public async Task<BlogForbiddenWord?> DeleteAync(int id)
        {
            var Model = await _Context.BlogForbiddenWord.FirstOrDefaultAsync(b => b.ID == id);
            if (Model == null)
            {
                return null;
            }

            _Context.BlogForbiddenWord.Remove(Model);
            await _Context.SaveChangesAsync();
            return Model;
        }
    }
}