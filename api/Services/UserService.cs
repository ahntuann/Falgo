using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using api.Dtos.User;
using api.Interface;
using api.Model;
using Microsoft.AspNetCore.Http.HttpResults;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using api.Dtos.Submission;
using api.Helpers;
using api.Dtos.ContesRegistation;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.IO;
using System.IO.Compression;

namespace api.Services
{
    public class UserService : IUserService
    {
        private readonly IContestRegistationRepository _contestRegisRepo;
        private readonly IUserRepository _userRepo;
        private readonly ISubmissionRepository _subRepo;
        private readonly IContestRepository _contestRepo;
        private readonly IWebHostEnvironment _env;
        private readonly ISubmissionService _submissionService;
        private readonly HttpClient _httpClient;
        private readonly IProgramingLanguageRepository _programingLanguageRepository;
        private readonly IProblemRepository _problemRepository;
        public UserService(IContestRegistationRepository contestRegisRepo, IUserRepository userRepo, IContestRepository contestRepo,
                        IWebHostEnvironment env, ISubmissionService submissionService, 
                        HttpClient httpClient, ISubmissionRepository submissionRepository,
                        IProgramingLanguageRepository programingLanguageRepository,
                        IProblemRepository problemRepository)
        {
            _contestRegisRepo = contestRegisRepo;
            _userRepo = userRepo;
            _contestRepo = contestRepo;
            _env = env;
            _submissionService = submissionService;
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("MyApp");
            _subRepo = submissionRepository;
            _programingLanguageRepository = programingLanguageRepository;
            _problemRepository = problemRepository;
        }

        public async Task<AppUser> GetUserByIdAsync(string userId)
        {
            return await _userRepo.GetUserByIdAsync(userId);
        }

        public async Task<bool?> IsUserRegisContest(string userId, string contestId)
        {
            var user = await _userRepo.GetUserByIdAsync(userId);
            var contest = await _contestRepo.GetContestByIdAsync(contestId);

            if (user == null || contest == null)
                return null;

            var contestRegis = await _contestRegisRepo.GetContestRegistionByUserAndContestAsync(user, contest);

            return contestRegis != null;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            string from = "wedfalgocode@gmail.com";
            string password = "qisn uzqc pdmn ljuc";
            MailMessage mail = new MailMessage();
            mail.To.Add(toEmail);
            mail.From = new MailAddress(from);
            mail.Subject = subject;
            mail.Body = body;

            SmtpClient smtp = new SmtpClient("smtp.gmail.com");
            smtp.EnableSsl = true;
            smtp.Port = 587;
            smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtp.Credentials = new NetworkCredential(from, password);
            try
            {
                smtp.Send(mail);
                Console.WriteLine("Gửi email thành công!");

            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi khi gửi email: " + ex.Message);
            }
        }

        public async Task<UserProfileDto> GetUserProfile(string userId)
        {
            var user = await _userRepo.GetUserByIdAsync(userId);
            
            if (user == null)
                return null;


            int totalSolved = await _userRepo.GetUserSolvedCountAsync(userId);
            int totalSubmissions = await _userRepo.GetUserSubmissionCountAsync(userId);

            return new UserProfileDto
            {
                UserName = user.UserName,
                FullName = user.FullName,
                Email = user.Email,
                DateOfBirth = user.DateOfBirth,
                PhoneNumber = user.PhoneNumber,
                CreatedAt = user.CreatedAt,
                TotalSubmissions = totalSubmissions,
                TotalSolved = totalSolved,
                Avatar = user.Avatar,
                Address = user.Address
            };
        }
        
        public async Task<bool> UpdateUserAsync(string userId, UpdateUserDto updateUserDto)
        {
            return await _userRepo.UpdateUserAsync(userId, updateUserDto);
        }

       public async Task<AvatarUpdateResult> UpdateUserAvatarAsync(string userId, IFormFile avatar)
        {
            var user = await _userRepo.GetUserByIdAsync(userId);
            
            if (user == null)
                return new AvatarUpdateResult { Success = false };
            
            // Tạo đường dẫn lưu file
            string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "avatars");
            
            // Đảm bảo thư mục tồn tại
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);
            
            // Tạo tên file duy nhất để tránh trùng lặp
            string uniqueFileName = Guid.NewGuid().ToString() + "_" + avatar.FileName;
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);
            
            // Lưu file vào thư mục
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await avatar.CopyToAsync(fileStream);
            }
            
            // Đường dẫn lưu vào database
            string avatarUrl = "/images/avatars/" + uniqueFileName;
            
            // Cập nhật đường dẫn avatar trong database
            user.Avatar = avatarUrl;
            
            // Lưu thay đổi vào database
            bool updated = await _userRepo.UpdateUser(user);
            
            return new AvatarUpdateResult
            {
                Success = updated,
                AvatarUrl = updated ? avatarUrl : null
            };
        }

        public async Task<PageResult<SubmissionListDto>> GetUserSubmissionsAsync(string userId, SubmissionListQueryObject query)
        {
            query.UserId = userId;
    
            return await _submissionService.GetUserSubmissionsWithProblemInfoAsync(userId, query);
        }

        public async Task<List<UserContestDto>> GetUserContestsAsync(string userId)
        {
            var user = await _userRepo.GetUserByIdAsync(userId);
            
            if (user == null)
                return null;
            
            var contests = await _contestRegisRepo.GetContestsByUserIdAsync(userId);
            
            return contests.Select(c => new UserContestDto
            {
                ContestId = c.ContestId,
                ContestName = c.ContestName,
                CreatedAt = c.CreatedAt,
                EndDate = c.EndDate,
                Level = c.Level,
                TotalPoint = c.TotalPoint,
                DueTime = c.DueTime
            }).ToList();
        }

        public async Task<byte[]> DownloadSubmissionSourceCodeAsync(string submissionId)
        {
            var submission = await _subRepo.GetSubmissionByIdAsync(submissionId);
            
            if (submission == null)
                return null;

            string problemTitle = await _problemRepository.GetProblemNameByIdAsync(submission.ProblemId);
            string languageName = await _programingLanguageRepository.GetLanguageNameByIdAsync(submission.ProgrammingLanguageId);
            
            string cleanProblemTitle = RemoveSpecialCharacters(problemTitle);

            string zipFileName = $"{submission.ProblemId}_{cleanProblemTitle}_{languageName}.zip";

            string tempZipPath = Path.Combine(Path.GetTempPath(), zipFileName);

            using (var archive = ZipFile.Open(tempZipPath, ZipArchiveMode.Create))
            {
                string fileExtension = GetFileExtensionByLanguage(languageName);
                string sourceCodeFileName = $"{submission.ProblemId}_{cleanProblemTitle}{fileExtension}";

                string tempSourceCodePath = Path.Combine(Path.GetTempPath(), sourceCodeFileName);
                
                await File.WriteAllTextAsync(tempSourceCodePath, submission.SourceCode);

                archive.CreateEntryFromFile(tempSourceCodePath, sourceCodeFileName);

                File.Delete(tempSourceCodePath);
            }

            byte[] zipBytes = await File.ReadAllBytesAsync(tempZipPath);

            File.Delete(tempZipPath);

            return zipBytes;
        }

        private string RemoveSpecialCharacters(string input)
        {
            return System.Text.RegularExpressions.Regex.Replace(input, @"[^a-zA-Z0-9_]", "");
        }

        private string GetFileExtensionByLanguage(string languageName)
        {
            return languageName.ToLower() switch
            {
                "cpp" => ".cpp",
                "java" => ".java",
                "python" => ".py",
                "javascript" => ".js",
                "csharp" => ".cs",
                _ => ".txt"
            };
        }
        public async Task<string> GetGitHubEmail(string accessToken)
        {
            return await _userRepo.GetGitHubEmail(accessToken);
        }

        public async Task<bool> CommitSubmissionToGitHub(string userId, string submissionId)
        {
            Console.WriteLine($"Committing submission for user: {userId}, submissionId: {submissionId}");

            var user = await _userRepo.GetUserByIdAsync(userId);
            
            if (user == null) 
            {
                Console.WriteLine("User not found");
                return false;
            }

            if (string.IsNullOrEmpty(user.GitHubAccessToken))
            {
                Console.WriteLine("GitHub access token is missing");
                return false;
            }

            var submission = await _subRepo.GetSubmissionByIdAsync(submissionId);
            
            if (submission == null)
            {
                Console.WriteLine("Submission not found");
                return false;
            }

            if (submission.AppUserId != userId)
            {
                Console.WriteLine("Submission does not belong to this user");
                return false;
            }

            string repoName = "Falgo";
            bool repoExists = await _userRepo.CheckRepositoryExists(user.GitHubAccessToken, repoName);
            if (!repoExists)
            {
                throw new Exception("Repository 'Falgo' does not exist. Please create it on GitHub.");
            }

            string filePath = $"submissions/{submission.SubmissionId}.txt";
            return await _userRepo.CommitCodeToRepository(user.GitHubAccessToken, repoName, filePath, submission.SourceCode);
        }

        public async Task<List<LanguageUsage>> GetTopProgrammingLanguagesAsync(string userId)
        {
            return await _userRepo.GetTopProgrammingLanguagesAsync(userId);
        }

        public async Task<List<CategoryPercentage>> GetProblemCategoryPercentageAsync(string userId)
        {
            return await _userRepo.GetProblemCategoryPercentageAsync(userId);
        }
        
    }

}