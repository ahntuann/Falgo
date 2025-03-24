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
    public class BlogLikeRepository : IBlogLikeRepository
    {
        private readonly ApplicationDBContext _Context;
        public BlogLikeRepository(ApplicationDBContext Context)
        {
            _Context = Context;
        }

        public async Task<List<BlogLike>> GetAllAsync()
        {
            return await _Context.BlogLike.ToListAsync();
        }

        public async Task<BlogLike?> FindBlogLike(BlogLikeDto request)
        {
            return await _Context.BlogLike.FirstOrDefaultAsync(bl => bl.BlogID == request.BlogID && bl.UserID == request.UserID
            );
        }
        public async Task<BlogLike?> DeleteAync(BlogLike request)
        {
            var BlogModel = await _Context.BlogLike.FirstOrDefaultAsync(bl => bl.BlogID == request.BlogID && bl.UserID == request.UserID
            );
            if (BlogModel == null)
            {
                return null;
            }
            _Context.BlogLike.Remove(BlogModel);
            await _Context.SaveChangesAsync();
            return BlogModel;
        }

        public async Task<BlogLike> CreateAsync(BlogLike request)
        {
            await _Context.BlogLike.AddAsync(request);
            await _Context.SaveChangesAsync();
            return request;
        }
    }
}