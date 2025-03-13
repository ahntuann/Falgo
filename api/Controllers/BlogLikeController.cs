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
    [Route("api/BlogLikeController")]
    [ApiController]
    public class BlogLikeController : ControllerBase
    {
        private readonly IBlogLikeService _blogLikeService;
        public BlogLikeController(IBlogLikeService blogLikeService)
        {
            _blogLikeService = blogLikeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var content = await _blogLikeService.GetAllBlogLikes();
            return Ok(content);
        }

        [HttpPost("ToggleLike")]
        public async Task<IActionResult> ToggleLike([FromBody] BlogLikeDto request)
        {
            var existingLike = await _blogLikeService.FindBlogLike(request);

            if (existingLike != null)
            {
                await _blogLikeService.DeleteBlogLike(existingLike);
                return Ok(new { message = "Bạn đã bỏ like", liked = false });
            }
            else
            {
                var newLike = request.ToBlogLikeFromCreateDto();
                await _blogLikeService.CreateAsync(newLike);
                return Ok(new { message = "Bạn đã like", liked = true });
            }
        }
    }
}