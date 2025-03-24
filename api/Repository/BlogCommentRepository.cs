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
    public class BlogCommentRepository : IBlogCommentRepository
    {
        private readonly ApplicationDBContext _Context;
        public BlogCommentRepository(ApplicationDBContext Context)
        {
            _Context = Context;
        }

        public async Task<List<CommentBlog>> GetAllAsync()
        {
            return await _Context.CommentBlog.ToListAsync();
        }

        public async Task<CommentBlog?> DeleteAync(int commentId)
        {
            var BlogModel = await _Context.CommentBlog.FirstOrDefaultAsync(bl => bl.ID == commentId);
            if (BlogModel == null)
            {
                return null;
            }
            _Context.CommentBlog.Remove(BlogModel);
            await _Context.SaveChangesAsync();
            return BlogModel;
        }

        public async Task<CommentBlog> CreateAsync(CommentBlog content)
        {
            await _Context.CommentBlog.AddAsync(content);
            await _Context.SaveChangesAsync();
            return content;
        }
    }
}