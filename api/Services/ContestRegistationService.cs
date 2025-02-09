using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ContestRegistation;
using api.Interface;
using api.Mappers;
using api.Model;

namespace api.Services
{
    public class ContestRegistationService : IContestRegistationService
    {
        private readonly IContestRegistationRepository _contestRegisRepo;
        public ContestRegistationService(IContestRegistationRepository contestRegisRepo)
        {
            _contestRegisRepo = contestRegisRepo;
        }

        public async Task<List<ContestRegistationDto?>> GetAllContestRegistationAsync(Contest contest)
        {
            var contestRegistions = await _contestRegisRepo.GetAllRegistationAsync(contest);

            return contestRegistions
                    .Select(x => x.ToContestRegistationDtoFromContestRegistation())
                    .ToList();
        }
    }
}