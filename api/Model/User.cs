using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;

namespace api.Model
{
    public class User
    {
    [Key] 
    public int UserId { get; set; }
    [Required, MaxLength(50)]
    public string Username { get; set; } = string.Empty;
    [Required]
    public string Password { get; set; } = string.Empty;
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;
    public string? Avatar { get; set; } 
    public DateTime? DateOfBirth { get; set; }
    [MaxLength(10)]
    public string? Phone { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 
    public int TotalSolved { get; set; } = 0;
    public int TotalSubmissions { get; set; } = 0;
    }
}