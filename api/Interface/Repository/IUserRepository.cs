using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.User;
using api.Model;

namespace api.Interface
{
    public interface IUserRepository
    {
        public Task<AppUser?> GetUserByIdAsync(string id);
        Task<int> GetUserSolvedCountAsync(string userId);
        Task<int> GetUserSubmissionCountAsync(string userId); 
        Task<bool> UpdateUserAsync(string userId, UpdateUserDto updateUserDto);
        Task<bool> UpdateUser(AppUser user);
        Task UpdateUserAsync(AppUser user);
        Task<string> GetGitHubEmail(string accessToken);
        Task<bool> CheckRepositoryExists(string accessToken, string repoName);
        Task<bool> CommitCodeToRepository(string accessToken, string repoName, string filePath, string content);
        Task<List<LanguageUsage>> GetTopProgrammingLanguagesAsync(string userId);
        Task<List<CategoryPercentage>> GetProblemCategoryPercentageAsync(string userId);

    }
}