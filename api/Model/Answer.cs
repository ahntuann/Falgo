using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Model
{
  public class Answer
    {
        [Key]
        public string AnswerId { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [ForeignKey("UserId")]
        public string? UserId { get; set; }
        public AppUser? User { get; set; } // Relationship with ASP.NET Identity User

        [Required]
        [ForeignKey("QuestionId")]
        public string QuestionId { get; set; } = string.Empty;
        public Question Question { get; set; } // Relationship with Question

        [Required]
        [MaxLength(5000)]
        public string Content { get; set; } = string.Empty;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}