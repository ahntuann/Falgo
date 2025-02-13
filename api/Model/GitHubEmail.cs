using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Model
{
    public class GitHubEmail
    {
    public string Email { get; set; } = string.Empty;
    public bool Primary { get; set; }
    public bool Verified { get; set; }
    }
}