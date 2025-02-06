using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace api.Model
{
    public class AppUser : IdentityUser
    {
        public string? FullName { get; set; } 
        public string? Address { get; set; }
        public string? Avatar { get; set; }  
        public DateTime? DateOfBirth { get; set; }  
        public string? PhoneNumber { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 
        public DateTime? LastLoginAt { get; set; } 
        public int TotalSolved { get; set; } = 0; 
        public int TotalSubmissions { get; set; } = 0; 
        public DateTime? LastSolvedAt { get; set; } 
    }
}