using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api.Model
{
    public class ContestRegistion
    {
        [Required]
        public string ContestId { get; set; } = string.Empty;
        [Required]
        public string Id { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Contest Contest { get; set; } = new Contest();
        public AppUser AppUser { get; set; } = new AppUser();
        public string AppUserId { get; set; } = string.Empty;
        public bool IsStart { get; set; } = false;
        public DateTime? StartAt { get; set; }
    }
}