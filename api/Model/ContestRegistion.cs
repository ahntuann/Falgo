using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Model
{
    public class ContestRegistion
    {
        [Required]
        public string ContestId { get; set; } = string.Empty;
        [Required]
        public string UserId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Contest Contest { get; set; } = new Contest();
        public User User { get; set; } = new User();
    }
}