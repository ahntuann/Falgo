using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.BlogSpace;
using api.Model;

namespace api.Interface.Repository
{
    public interface IBlogLikeRepository
    {
        Task<List<BlogLike>> GetAllAsync();
        Task<BlogLike?> FindBlogLike(BlogLikeDto request);
        Task<BlogLike?> DeleteAync(BlogLike request);
        Task<BlogLike> CreateAsync(BlogLike request);

    }
}