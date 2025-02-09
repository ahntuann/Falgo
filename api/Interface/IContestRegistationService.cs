using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ContestRegistation;
using api.Model;

namespace api.Interface
{
    public interface IContestRegistationService
    {
        public Task<List<ContestRegistationDto?>> GetAllContestRegistationAsync(Contest contest);
    }
}