using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Helpers
{
    public class UserQueryObject
    {
        [Required]
        public string UserId { get; set; } = string.Empty;
        [Required]
        public string ContestId { get; set; } = string.Empty;

    }
}