using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.BlogSpace;
using api.Model;

namespace api.Interface.Repository
{
    public interface IBlogCommentRepository
    {
        Task<List<CommentBlog>> GetAllAsync();
        Task<CommentBlog?> DeleteAync(int commentId);
        Task<CommentBlog> CreateAsync(CommentBlog content);

    }
}