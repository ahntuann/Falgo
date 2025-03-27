using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.ContesRegistation
{
    public class StartContestDto
    {
        [Required]
        public string ContestId { get; set; } = string.Empty;
        [Required]
        public string UserId { get; set; } = string.Empty;
    }
}