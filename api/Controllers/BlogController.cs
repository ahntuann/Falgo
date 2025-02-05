using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos;
using api.Interface;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/BlogController")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IBlogRepository _BlogRepo;

        public BlogController(IBlogRepository blogRepo)
        {
            _BlogRepo = blogRepo;
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
            // var stock = await _context.stock.FindAsync(id);
            var stock = await _BlogRepo.GetByIDAsync(id);

            if (stock == null)
            {
                return NotFound();
            }

            return Ok(stock.ToBlogDto());
        }
        [HttpPost]
        public async Task<IActionResult> create([FromBody] CreateBlogRequestDto BlogDto)
        {

            var BlogModel = BlogDto.ToBlogFromCreateDto();
            await _BlogRepo.CreateAsync(BlogModel);
            return CreatedAtAction(nameof(GetByID), new { id = BlogModel.ID }, BlogModel.ToBlogDto());
        }


    }
}