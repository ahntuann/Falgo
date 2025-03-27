using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using api.Model;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Model
{
public class Question
    {
        [Key]
        public string QuestionId { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [ForeignKey("UserId")]
          
        public string? UserId { get; set; } 
        public AppUser? User { get; set; } // Relationship with ASP.NET Identity User

        [Required]
        [MaxLength(5000)]
        public string Content { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = string.Empty;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // One Question can have multiple Answers
      public ICollection<Answer> Answers { get; set; }
}
}
    