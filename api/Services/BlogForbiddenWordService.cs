using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.BlogSpace;
using api.Interface.Repository;
using api.Interface.Services;
using api.Model;

namespace api.Services
{
    public class BlogForbiddenWordService : IBlogForbiddenWordService
    {
        private readonly IBlogForbiddenWordRepository _blogForbiddenWordRepository;

        public BlogForbiddenWordService(IBlogForbiddenWordRepository blogForbiddenWordRepository)
        {
            _blogForbiddenWordRepository = blogForbiddenWordRepository;
        }

        public async Task<BlogForbiddenWord> CreateAsync(BlogForbiddenWord model)
        {
            return await _blogForbiddenWordRepository.CreateAsync(model);
        }

        public async Task<List<BlogForbiddenWord>> GetAllAsync()
        {
            return await _blogForbiddenWordRepository.GetAllAsync();
        }

        public async Task<BlogForbiddenWord?> GetByIDAsync(int id)
        {
            return await _blogForbiddenWordRepository.GetByIDAsync(id);
        }

        public async Task<BlogForbiddenWord?> UpdateAync(int id, CreateUpdateBlogForbiddenWordRequestDto dto)
        {
            return await _blogForbiddenWordRepository.UpdateAync(id, dto);
        }

        public async Task<BlogForbiddenWord?> DeleteAync(int id)
        {
            return await _blogForbiddenWordRepository.DeleteAync(id);
        }
    }

}