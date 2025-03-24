using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.BlogSpace;
using api.Interface.Services;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/BlogCommentController")]
    [ApiController]
    public class BlogCommentController : ControllerBase
    {
        private readonly IBlogCommentService _blogCommentService;
        public BlogCommentController(IBlogCommentService blogCommentService)
        {
            _blogCommentService = blogCommentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var content = await _blogCommentService.GetAllComments();
            var contentDto = content.Select(s => s.ToBlogCommentDto());
            return Ok(content);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteComment([FromQuery] int commentId)
        {
            var deletedComment = await _blogCommentService.DeleteAync(commentId);

            if (deletedComment == null)
            {
                return NotFound("Không tìm thấy bình luận để xóa");
            }
            return Ok($"Đã xóa bình luận ID {commentId}");
        }

        // [HttpPost]
        // public async Task<IActionResult> create([FromBody] CreateCommentBlogRequestDto BlogDto)
        // {
        //     var content = BlogDto.ToCommentBlogFromCreateDto();
        //     content.Status = "Bình Thường";

        //     await _blogCommentService.CreateAsync(content);
        //     return Ok("Đã thêm comment thành công!");
        // }

        [HttpPost]
        public async Task<IActionResult> create([FromBody] CreateCommentBlogRequestDto BlogDto)
        {
            var content = BlogDto.ToCommentBlogFromCreateDto();
            content.Status = "Bình Thường";

            await _blogCommentService.CreateAsync(content);

            return Ok(new { message = "Đã thêm comment thành công!", comment = content });
        }

    }
}