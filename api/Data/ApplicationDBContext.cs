using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace api.Data
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
        {

        }
        public DbSet<Problem> Problems { get; set; }
        public DbSet<Submission> Submissions { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<ContestRegistion> ContestRegistions { get; set; }
        public DbSet<TestCase> TestCases { get; set; }
        public DbSet<TestCaseStatus> TestCaseStatus { get; set; }
        public DbSet<ContestProblem> ContestProblems { get; set; }
        public DbSet<Contest> Contests { get; set; }
        public DbSet<ProgrammingLanguage> ProgrammingLanguage { get; set; }

        //BlogDaTa
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<CommentBlog> CommentBlog { get; set; }
        public DbSet<BlogLike> BlogLike { get; set; }
        public DbSet<BlogShare> BlogShare { get; set; }
        public DbSet<BlogBookmark> BlogBookmark { get; set; }
        public DbSet<BlogForbiddenWord> BlogForbiddenWord { get; set; }

        //EndBlogData
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<TestCaseStatus>()
                .HasKey(tc => new { tc.TestCaseId, tc.SubmissionId });

            modelBuilder.Entity<TestCaseStatus>()
                .HasOne(tc => tc.Submission)
                .WithMany(s => s.TestCaseStatuses)
                .HasForeignKey(tc => tc.SubmissionId);

            modelBuilder.Entity<TestCaseStatus>()
                .HasOne(tc => tc.TestCase)
                .WithMany(t => t.TestCaseStatuses)
                .HasForeignKey(tc => tc.TestCaseId);

            modelBuilder.Entity<ContestProblem>()
                .HasKey(cp => new { cp.ContestId, cp.ProblemId });

            modelBuilder.Entity<ContestRegistion>()
                .HasKey(cr => new { cr.Id, cr.ContestId });

            List<IdentityRole> roles = new List<IdentityRole>
    {
        new IdentityRole { Name = "User", NormalizedName = "USER" },
        new IdentityRole { Name = "Guest", NormalizedName = "GUEST" },
        new IdentityRole { Name = "Admin", NormalizedName = "ADMIN" }
    };

            modelBuilder.Entity<IdentityRole>().HasData(roles);
        }




    }
}