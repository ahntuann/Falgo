using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Model
{
    public class ContestProblem
    {
    [Required]
    public string ContestId { get; set;} = string.Empty;
    [Required]
    public string ProblemId { get; set;} = string.Empty;
    public Contest Contest { get; set; } = new Contest();
    public Problem Problem { get; set; } = new Problem();
    }
}