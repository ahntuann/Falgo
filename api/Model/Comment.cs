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
    public int CommentId { get; set; }
    [Required]
    [MaxLength(500)] 
    public string Content { get; set; } = string.Empty;
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    [Required]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = new User();
    public Problem Problem { get; set; } =  new Problem();
    }
}