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
    public class BlogBookmarkService : IBlogBookmarkService
    {
        private readonly IBlogBookmarkRepository _blogBookmarkService;

        public BlogBookmarkService(IBlogBookmarkRepository blogLikeRepository)
        {
            _blogBookmarkService = blogLikeRepository;
        }

        public async Task<List<BlogBookmark>> GetAllBlogBookmark()
        {
            return await _blogBookmarkService.GetAllBlogBookmark();
        }

        public async Task<BlogBookmark?> FindBlogBookmar(BlogBookmarkDto request)
        {
            return await _blogBookmarkService.FindBlogBookmar(request);
        }

        public async Task<BlogBookmark?> DeleteBlogBookmar(BlogBookmark request)
        {
            return await _blogBookmarkService.DeleteBlogBookmar(request);
        }

        public async Task<BlogBookmark> CreateBlogBookmar(BlogBookmark request)
        {
            return await _blogBookmarkService.CreateBlogBookmar(request);
        }
    }
}