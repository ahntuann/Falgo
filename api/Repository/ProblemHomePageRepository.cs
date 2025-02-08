using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interface;

namespace api.Repository
{
    public class ProblemHomePageRepository : IProblemHomePageRepository
    {
        private readonly ApplicationDBContext _context;
        public ProblemHomePageRepository(ApplicationDBContext context)
        {
            _context = context;
        }


    }
}