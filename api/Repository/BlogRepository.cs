using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.BlogSpace;
using api.Interface;
using api.Model;
using Microsoft.EntityFrameworkCore;


namespace api.Repository
{
    public class BlogRepository : IBlogRepository
    {
        private readonly ApplicationDBContext _Context;
        public BlogRepository(ApplicationDBContext Context)
        {
            _Context = Context;
        }

        public async Task<Blog> CreateAsync(Blog BlogModel)
        {
            await _Context.Blogs.AddAsync(BlogModel);
            await _Context.SaveChangesAsync();
            return BlogModel;
        }

        public async Task<Blog?> DeleteAync(int id)
        {
            var BlogModel = await _Context.Blogs.Include(b => b.BlogLike).Include(b => b.BlogShare).Include(b => b.CommentBlog).Include(b => b.BlogBookmark).FirstOrDefaultAsync(b => b.ID == id);
            if (BlogModel == null)
            {
                return null;
            }

            _Context.BlogLike.RemoveRange(BlogModel.BlogLike);
            _Context.BlogShare.RemoveRange(BlogModel.BlogShare);
            _Context.CommentBlog.RemoveRange(BlogModel.CommentBlog);
            _Context.BlogBookmark.RemoveRange(BlogModel.BlogBookmark);

            _Context.Blogs.Remove(BlogModel);
            await _Context.SaveChangesAsync();
            return BlogModel;
        }

        public async Task<List<Blog>> GetAllAsync()
        {
            return await _Context.Blogs
                .Include(b => b.CommentBlog)
                .Include(b => b.BlogLike)
                .Include(b => b.BlogShare)
                .Include(b => b.BlogBookmark)
                .ToListAsync();
        }

        public async Task<Blog?> GetByIDAsync(int id)
        {
            return await _Context.Blogs.FirstOrDefaultAsync(i => i.ID == id);
        }

        public async Task<List<Blog>> GetByUserIDAsync(string id)
        {
            return await _Context.Blogs.Where(i => (i.UserId ?? "").Equals(id)).ToListAsync();
        }

        public async Task<Blog?> UpdateAync(int id, UpdateBlogRequesDto BlogDto)
        {
            var existingBlog = await _Context.Blogs.FirstOrDefaultAsync(x => x.ID == id);
            if (existingBlog == null)
            {
                return null;
            }

            existingBlog.Thumbnail = BlogDto.Thumbnail;
            existingBlog.title = BlogDto.title;
            existingBlog.description = BlogDto.description;
            existingBlog.Content = BlogDto.Content;
            existingBlog.ImageBlog = BlogDto.ImageBlog;
            existingBlog.CategoryBlog = BlogDto.CategoryBlog;
            existingBlog.Status = BlogDto.Status;
            existingBlog.Note = BlogDto.Note;

            await _Context.SaveChangesAsync();

            return existingBlog;
        }
    }
}