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
    [Route("api/BlogForbiddenWordController")]
    [ApiController]
    public class BlogForbiddenWordController : ControllerBase
    {
        private readonly IBlogForbiddenWordService _blogForbiddenWordService;
        public BlogForbiddenWordController(IBlogForbiddenWordService blogForbiddenWordService)
        {
            _blogForbiddenWordService = blogForbiddenWordService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var content = await _blogForbiddenWordService.GetAllAsync();
            return Ok(content);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID([FromRoute] int id)
        {
            var stock = await _blogForbiddenWordService.GetByIDAsync(id);

            if (stock == null)
            {
                return NotFound();
            }

            return Ok(stock.ToBlogForbiddenWordDto());
        }

        [HttpPost]
        public async Task<IActionResult> create([FromBody] CreateUpdateBlogForbiddenWordRequestDto Dto)
        {
            var Model = Dto.ToBlogForbiddenWordFromCreateDto();

            await _blogForbiddenWordService.CreateAsync(Model);

            return CreatedAtAction(nameof(GetByID), new { id = Model.ID }, Model.ToBlogForbiddenWordDto());
        }

        [HttpPut]
        [Route("{id}")]

        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] CreateUpdateBlogForbiddenWordRequestDto updateDto)
        {
            var Model = await _blogForbiddenWordService.UpdateAync(id, updateDto);
            if (Model == null)
            {
                return NotFound();
            }

            return Ok(Model.ToBlogForbiddenWordDto());
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var stockModel = await _blogForbiddenWordService.DeleteAync(id);

            if (stockModel == null)
            {
                return NotFound();
            }
            return Ok(stockModel.ID + "Delete");
        }
    }
}