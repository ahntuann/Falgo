using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Model;

namespace api.Interface
{
    public interface ISubmissionRepository
    {
        public Task<List<Submission>> GetSubmissionsByProblemIdAsync(string problemId);
        public Task<List<Submission?>> GetAllSubmissionAtMonthAsync(int month, int year);
    }
}