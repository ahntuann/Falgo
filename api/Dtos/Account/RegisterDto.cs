using System;
using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Account
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }  

        [Required]
        [EmailAddress]
        public string Email { get; set; }  

        [Required]
        public string Password { get; set; }  

        [Required ]public string? FullName { get; set; }    
        [Required ]public string? Address { get; set; }
        [Required] public string PhoneNumber { get; set; } 
        [Required] public DateTime? DateOfBirth { get; set; }
    }
}
