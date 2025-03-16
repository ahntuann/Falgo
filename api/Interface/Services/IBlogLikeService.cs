using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.BlogSpace;
using api.Model;

namespace api.Interface.Services
{
    public interface IBlogLikeService
    {
        Task<List<BlogLike>> GetAllBlogLikes();
        Task<BlogLike?> FindBlogLike(BlogLikeDto request);
        Task<BlogLike?> DeleteBlogLike(BlogLike request);
        Task<BlogLike> CreateAsync(BlogLike request);

    }
}