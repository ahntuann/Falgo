using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Helpers
{
    public class ProgrammingLanguageQueryObject
    {
        [Required]
        public string UserId { get; set; } = string.Empty;
        [Required]
        public bool isAccepted { get; set; }
    }
}