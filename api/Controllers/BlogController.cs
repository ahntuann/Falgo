using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
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
    }
}