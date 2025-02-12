using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interface;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/programinglanguage")]
    [ApiController]
    public class ProgramingLanguageController : ControllerBase
    {
        private readonly IProgramingLanguageService _proLanguageService;
        public ProgramingLanguageController(IProgramingLanguageService proLanguageService)
        {
            _proLanguageService = proLanguageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProLanguage()
        {
            var proLanguageDto = await _proLanguageService.GetAllProLanguageAsync();

            if (proLanguageDto == null)
                return NotFound("There are no programing language");

            return Ok(proLanguageDto);
        }
    }
}