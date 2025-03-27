using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.BlogSpace;
using api.Model;

namespace api.Interface.Services
{
    public interface IBlogCommentService
    {
        Task<List<CommentBlog>> GetAllComments();
        Task<CommentBlog?> DeleteAync(int commentId);
        Task<CommentBlog> CreateAsync(CommentBlog content);
        Task<CommentBlog?> UpdateAsync(int id, UpdateBlogCommentDto BlogcmtDto);
    }
}