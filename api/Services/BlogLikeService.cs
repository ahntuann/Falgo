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
    public class BlogLikeService : IBlogLikeService
    {
        private readonly IBlogLikeRepository _blogLikeRepository;

        public BlogLikeService(IBlogLikeRepository blogLikeRepository)
        {
            _blogLikeRepository = blogLikeRepository;
        }

        public async Task<List<BlogLike>> GetAllBlogLikes()
        {
            return await _blogLikeRepository.GetAllAsync();
        }
        public async Task<BlogLike?> FindBlogLike(BlogLikeDto request)
        {
            return await _blogLikeRepository.FindBlogLike(request);
        }
        public async Task<BlogLike?> DeleteBlogLike(BlogLike request)
        {
            return await _blogLikeRepository.DeleteAync(request);
        }
        public async Task<BlogLike> CreateAsync(BlogLike request)
        {
            return await _blogLikeRepository.CreateAsync(request);
        }
    }
}