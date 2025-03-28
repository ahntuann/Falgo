using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using api.Helpers;
using api.Interface.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace api.Controllers
{
   [Route("/api/QandA")]
    [ApiController]
    public class QandAController : ControllerBase
    {
        private readonly IQandAService _IQandAService;
        public QandAController(IQandAService IQandAService)
        {
            _IQandAService=IQandAService;
        }
        [HttpGet]
        public async Task<IActionResult>GetAllQuestion([FromQuery] QandAObjectQuery query)
        {
            var Question =await _IQandAService.GetAllQuestion(query);
            return Ok(Question);
        }
    }
}