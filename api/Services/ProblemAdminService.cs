using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using api.Dtos.Admin;
using api.Interface;
using api.Mappers;
using api.Data;
using Microsoft.IdentityModel.Tokens;
using api.Model;
using FirebaseAdmin.Messaging;
namespace api.Services
{
    

    public class ProblemAdminService : IProblemAdminService
    {
        private readonly ISubmissionRepository _submissionRepo;
        private readonly IProblemAdminRepository _prob;
        
        public ProblemAdminService(ISubmissionRepository submissionRepo,IProblemAdminRepository prob  )
        {
            _submissionRepo = submissionRepo;
            _prob = prob;
         
        }
       public async Task<List<ProblemDashboardDto?>> GetxProblemDashBoardMostAttemped(int topN,Boolean asc)
        {
            var submissions = await _submissionRepo.GetAllSubmissionsAsync();
            var LProb= await _prob.GetAllProblemAsync();
            if (submissions == null)
                return null;
                List<ProblemDashboardDto> LProblem= new List<ProblemDashboardDto>();
                int countNum=0;
        foreach (Problem x in LProb)
        {
           
            int count = submissions.Where(s => s.Problem.ProblemId.Equals(x.ProblemId)).Count();
            ProblemDashboardDto tmp = ProblemDashboardMapper.ToProblemDashboardDtoFromProblem(x);
            ;
            LProblem.Add( ProblemDashboardMapper.AddNumberSub(tmp,count) ); countNum++;
            
            //if(countNum==topN)return LProblem;
        }
      
   
            return  LProblem;
        }
    }
}