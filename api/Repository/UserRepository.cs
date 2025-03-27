using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.User;
using api.Interface;
using api.Model;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly HttpClient _httpClient;
        public UserRepository(ApplicationDBContext context, HttpClient httpClient)
        {
            _context = context;
            _httpClient = httpClient;
        }

        public async Task<AppUser?> GetUserByIdAsync(string id)
        {
            var user = await _context.AppUsers.FirstOrDefaultAsync(x => x.Id.Equals(id));

            return user;
        }

        public async Task<int> GetUserSolvedCountAsync(string userId)
        {
            return await _context.Submissions
        .Where(s => s.AppUserId == userId && s.Status == "Accepted")
        .Select(s => s.ProblemId)
        .Distinct()
        .CountAsync();
        }

        public async Task<int> GetUserSubmissionCountAsync(string userId)
        {
            return await _context.Submissions
            .Where(s => s.AppUserId == userId)
            .CountAsync();
        }
        public async Task<bool> UpdateUserAsync(string userId, UpdateUserDto updateUserDto)
        {
            var user = await _context.AppUsers.FirstOrDefaultAsync(x => x.Id.Equals(userId));
            
            if (user == null)
                return false;
                
            if (!string.IsNullOrEmpty(updateUserDto.FullName))
                user.FullName = updateUserDto.FullName;
                
            if (!string.IsNullOrEmpty(updateUserDto.UserName))
                user.UserName = updateUserDto.UserName;
                
            if (!string.IsNullOrEmpty(updateUserDto.Address))
                user.Address = updateUserDto.Address;
                
            if (!string.IsNullOrEmpty(updateUserDto.Avatar))
                user.Avatar = updateUserDto.Avatar;
                
            if (updateUserDto.DateOfBirth.HasValue)
                user.DateOfBirth = updateUserDto.DateOfBirth;
                
            if (!string.IsNullOrEmpty(updateUserDto.PhoneNumber))
                user.PhoneNumber = updateUserDto.PhoneNumber;
                
            if (!string.IsNullOrEmpty(updateUserDto.Email))
                user.Email = updateUserDto.Email;
                
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public async Task<bool> UpdateUser(AppUser user)
        {
            _context.AppUsers.Update(user);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task UpdateUserAsync(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task<string> GetGitHubEmail(string accessToken)
        {
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("MyApp");

            var response = await _httpClient.GetStringAsync("https://api.github.com/user/emails");
            var emails = JsonSerializer.Deserialize<List<GitHubEmail>>(response);
            var primaryEmail = emails?.FirstOrDefault(e => e.Primary && e.Verified)?.Email;

            return primaryEmail ?? emails?.FirstOrDefault()?.Email;
        }

        public async Task<bool> CheckRepositoryExists(string accessToken, string repoName)
        {
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            var response = await _httpClient.GetAsync($"https://api.github.com/repos/{repoName}");

            return response.IsSuccessStatusCode;
        }

        public async Task<bool> CommitCodeToRepository(string accessToken, string repoName, string filePath, string content)
        {
            var url = $"https://api.github.com/repos/{repoName}/contents/{filePath}";
            var requestBody = new
            {
                message = "Commit source code",
                content = Convert.ToBase64String(Encoding.UTF8.GetBytes(content))
            };

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("MyApp");

            var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync(url, jsonContent);

            return response.IsSuccessStatusCode;
        }

        public async Task<List<LanguageUsage>> GetTopProgrammingLanguagesAsync(string userId)
        {
            var topLanguages = await _context.Submissions
                .Where(s => s.AppUserId == userId)
                .GroupBy(s => s.ProgrammingLanguageId)
                .Select(g => new 
                {
                    LanguageId = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(x => x.Count)
                .Take(5)
                .Join(_context.ProgrammingLanguage,
                    submission => submission.LanguageId,
                    language => language.ProgrammingLanguageId,
                    (submission, language) => new LanguageUsage
                    {
                        Language = language.Language ?? "Unknown", 
                        Count = submission.Count
                    })
                .ToListAsync();

            return topLanguages;
        }

        public async Task<List<CategoryPercentage>> GetProblemCategoryPercentageAsync(string userId)
        {
            var totalSubmissions = await _context.Submissions
                .CountAsync(s => s.AppUserId == userId);

            var categoryPercentages = await _context.Submissions
                .Where(s => s.AppUserId == userId)
                .Join(_context.Problems,
                    submission => submission.ProblemId,
                    problem => problem.ProblemId,
                    (submission, problem) => problem.Category)
                .GroupBy(category => category)
                .Select(g => new CategoryPercentage
                {
                    Category = g.Key,
                    Percentage = Math.Round((double)g.Count() / totalSubmissions * 100, 2)
                })
                .OrderByDescending(x => x.Percentage)
                .ToListAsync();

            return categoryPercentages;
        }
    }
}