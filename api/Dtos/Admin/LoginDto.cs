using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
namespace api.Dtos.Admin
{
    public class LoginDto
    {
         [Required] public required string Username { get; set; }
        [Required] public required string Password { get; set; }
    }
}