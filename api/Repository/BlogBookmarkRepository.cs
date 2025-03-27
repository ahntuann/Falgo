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
    public class BlogBookmarkRepository : IBlogBookmarkRepository
    {
        private readonly ApplicationDBContext _Context;
        public BlogBookmarkRepository(ApplicationDBContext Context)
        {
            _Context = Context;
        }

        public async Task<List<BlogBookmark>> GetAllBlogBookmark()
        {
            return await _Context.BlogBookmark.ToListAsync();
        }

        public async Task<BlogBookmark?> FindBlogBookmar(BlogBookmarkDto request)
        {
            return await _Context.BlogBookmark.FirstOrDefaultAsync(bl => bl.BlogID == request.BlogID && bl.UserID == request.UserID
            );
        }

        public async Task<BlogBookmark?> DeleteBlogBookmar(BlogBookmark request)
        {
            var BlogModel = await _Context.BlogBookmark.FirstOrDefaultAsync(bl => bl.BlogID == request.BlogID && bl.UserID == request.UserID
            );
            if (BlogModel == null)
            {
                return null;
            }
            _Context.BlogBookmark.Remove(BlogModel);
            await _Context.SaveChangesAsync();
            return BlogModel;
        }

        public async Task<BlogBookmark> CreateBlogBookmar(BlogBookmark request)
        {
            await _Context.BlogBookmark.AddAsync(request);
            await _Context.SaveChangesAsync();
            return request;
        }

    }
}