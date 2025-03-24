using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.ContesRegistation;
using api.Dtos.Submission;
using api.Dtos.User;
using api.Helpers;
using api.Model;

namespace api.Interface
{
    public interface IUserService
    {
        public Task<bool?> IsUserRegisContest(string userId, string contestId);
        public Task SendEmailAsync(string toEmail, string subject, string body);
        public Task<AppUser> GetUserByIdAsync(string userId);
        Task<UserProfileDto> GetUserProfile(string userId);
        Task<bool> UpdateUserAsync(string userId, UpdateUserDto updateUserDto);
        Task<AvatarUpdateResult> UpdateUserAvatarAsync(string userId, IFormFile avatar);
        Task<PageResult<SubmissionListDto>> GetUserSubmissionsAsync(string userId, SubmissionListQueryObject query);
        Task<List<UserContestDto>> GetUserContestsAsync(string userId);
    }
}