using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.BlogSpace;
using api.Interface.Services;
using api.Mappers;
using api.Model;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/BlogShareController")]
    [ApiController]
    public class BlogShareController : ControllerBase
    {
        private readonly IBlogShareService _blogShareService;
        public BlogShareController(IBlogShareService blogShareService)
        {
            _blogShareService = blogShareService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var Content = await _blogShareService.GetAllBlogShare();
            return Ok(Content);
        }

        [HttpPost]
        public async Task<IActionResult> create([FromBody] BlogShareDto BlogShareDto)
        {
            var newShare = BlogShareDto.ToBlogShareFromCreateDto();
            await _blogShareService.CreateAsync(newShare);

            return Ok(new { message = "Đã chia sẻ", Shared = true });
        }
    }
}