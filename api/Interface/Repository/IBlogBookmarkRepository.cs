using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.BlogSpace;
using api.Model;

namespace api.Interface.Repository
{
    public interface IBlogBookmarkRepository
    {
        Task<List<BlogBookmark>> GetAllBlogBookmark();
        Task<BlogBookmark?> FindBlogBookmar(BlogBookmarkDto request);
        Task<BlogBookmark?> DeleteBlogBookmar(BlogBookmark request);
        Task<BlogBookmark> CreateBlogBookmar(BlogBookmark request);
    }
}