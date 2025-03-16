using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interface.Repository;
using api.Interface.Services;
using api.Model;

namespace api.Services
{
    public class BlogShareService : IBlogShareService
    {
        private readonly IBlogShareRepository _blogShareRepository;
        public BlogShareService(IBlogShareRepository blogShareRepository)
        {
            _blogShareRepository = blogShareRepository;
        }

        public async Task<List<BlogShare>> GetAllBlogShare()
        {
            return await _blogShareRepository.GetAllAsync();
        }

        public async Task<BlogShare> CreateAsync(BlogShare Content)
        {
            return await _blogShareRepository.CreateAsync(Content);
        }
    }
}