using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ContestRegistation;
using api.Model;

namespace api.Mappers
{
    public static class ContestRegistationMapper
    {
        public static ContestRegistationDto ToContestRegistationDtoFromContestRegistation(this ContestRegistion contestRegistion)
        {
            return new ContestRegistationDto
            {
                Id = contestRegistion.Id
            };
        }
    }
}