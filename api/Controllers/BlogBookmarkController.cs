using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.BlogSpace;
using api.Interface.Repository;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/BlogBookmarkController")]
    [ApiController]
    public class BlogBookmarkController : ControllerBase
    {
        private readonly IBlogBookmarkRepository _Service;
        public BlogBookmarkController(IBlogBookmarkRepository Service)
        {
            _Service = Service;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var content = await _Service.GetAllBlogBookmark();
            return Ok(content);
        }

        [HttpPost("ToggleBookmark")]
        public async Task<IActionResult> ToggleBookmark([FromBody] BlogBookmarkDto request)
        {
            var existing = await _Service.FindBlogBookmar(request);

            if (existing != null)
            {
                await _Service.DeleteBlogBookmar(existing);
                return Ok(new { message = "Bạn đã bỏ lưu", Bookmarked = false });
            }
            else
            {
                var newLike = request.ToBlogBookmarkFromCreateDto();
                await _Service.CreateBlogBookmar(newLike);
                return Ok(new { message = "Bạn đã lưu", Bookmarked = true });
            }
        }
    }
}