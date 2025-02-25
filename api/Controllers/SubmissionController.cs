using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interface;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("/api/submission")]
    [ApiController]
    public class SubmissionController : ControllerBase
    {
        private readonly ISubmissionService _submissionService;
        public SubmissionController(ISubmissionService subService)
        {
            _submissionService = subService;
        }


    }
}