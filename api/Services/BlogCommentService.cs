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
    public class BlogCommentService : IBlogCommentService
    {
        private readonly IBlogCommentRepository _blogCommentRepository;

        public BlogCommentService(IBlogCommentRepository blogCommentRepository)
        {
            _blogCommentRepository = blogCommentRepository;
        }

        public async Task<List<CommentBlog>> GetAllComments()
        {
            return await _blogCommentRepository.GetAllAsync();
        }

        public async Task<CommentBlog?> DeleteAync(int commentId)
        {
            return await _blogCommentRepository.DeleteAync(commentId);
        }

        public async Task<CommentBlog> CreateAsync(CommentBlog content)
        {
            return await _blogCommentRepository.CreateAsync(content);
        }
    }
}