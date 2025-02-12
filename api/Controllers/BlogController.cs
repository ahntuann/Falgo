using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos;
using api.Dtos.BlogSpace;
using api.Extensions;
using api.Interface;
using api.Mappers;
using api.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/BlogController")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IBlogRepository _BlogRepo;
        private readonly UserManager<AppUser> _userManager;
        public BlogController(IBlogRepository blogRepo, UserManager<AppUser> userManager)
        {
            _BlogRepo = blogRepo;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var blogs = await _BlogRepo.GetAllAsync();
            var blogsDto = blogs.Select(s => s.ToBlogDto());
            return Ok(blogsDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID([FromRoute] int id)
        {
            var stock = await _BlogRepo.GetByIDAsync(id);

            if (stock == null)
            {
                return NotFound();
            }

            return Ok(stock.ToBlogDto());
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUserID([FromRoute] string userId)
        {
            var blogs = await _BlogRepo.GetByUserIDAsync(userId);
            var blogsDto = blogs.Select(s => s.ToBlogDto());

            return Ok(blogsDto);
        }

        [HttpPost]
        public async Task<IActionResult> create([FromBody] CreateBlogRequestDto BlogDto)
        {

            string? userId = User.GetUserId();

            var BlogModel = BlogDto.ToBlogFromCreateDto(userId);
            BlogModel.UserId = userId;

            await _BlogRepo.CreateAsync(BlogModel);

            return CreatedAtAction(nameof(GetByID), new { id = BlogModel.ID }, BlogModel.ToBlogDto());
        }

        [HttpPut]
        [Route("{id}")]

        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateBlogRequesDto updateDto)
        {
            if (User?.Identity?.IsAuthenticated != true)
            {
                return Unauthorized("Bạn Cần đăng nhập.");
            }
            string? userId = User.GetUserId();
            var CheckBlogModel = await _BlogRepo.GetByIDAsync(id);
            if (CheckBlogModel == null)
            {
                return NotFound("Không tìm thấy bài viết.");
            }
            if (CheckBlogModel.UserId != userId)
            {
                return Forbid("Bạn không có quyền chỉnh sửa bài viết này.");
            }

            var BlogModel = await _BlogRepo.UpdateAync(id, updateDto);
            if (BlogModel == null)
            {
                return NotFound();
            }

            return Ok(BlogModel.ToBlogDto());
        }

        [HttpDelete]
        [Route("{id}")]

        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (User?.Identity?.IsAuthenticated != true)
            {
                return Unauthorized("Bạn Cần đăng nhập.");
            }
            string? userId = User.GetUserId();
            var CheckBlogModel = await _BlogRepo.GetByIDAsync(id);
            if (CheckBlogModel == null)
            {
                return NotFound("Không tìm thấy bài viết.");
            }
            if (CheckBlogModel.UserId != userId)
            {
                return Forbid("Bạn không có quyền chỉnh xóa bài viết này.");
            }
            var stockModel = await _BlogRepo.DeleteAync(id);

            if (stockModel == null)
            {
                return NotFound();
            }
            return Ok(stockModel.ID + "Delete");
        }
    }
}