using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Model
{
    public class Comment
    {
        [Key]
        public string CommentId { get; set; } = string.Empty;
        [Required]
        [MaxLength(500)]
        public string Content { get; set; } = string.Empty;
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [Required]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public AppUser User { get; set; } = new AppUser();
        public Problem Problem { get; set; } = new Problem();
    }
}