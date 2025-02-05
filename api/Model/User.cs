using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Model
{
    public class User
    {
        public int UserId { get; set; }  // Mã người dùng (ID)
        public string Username { get; set; } = string.Empty;  // Tên người dùng
        public string Password { get; set; } = string.Empty;  // Mật khẩu
        public string Email { get; set; } = string.Empty;  // Địa chỉ email
        public string FullName { get; set; } = string.Empty;  // Họ và tên đầy đủ
        public string Address { get; set; } = string.Empty;  // Địa chỉ
        public string Avatar { get; set; } = string.Empty;  // URL ảnh đại diện
        public DateTime DateOfBirth { get; set; }  // Ngày sinh
        public string Phone { get; set; } = string.Empty;  // Số điện thoại
        public DateTime CreatedAt { get; set; } = DateTime.Now;  // Thời gian tạo tài khoản
        public DateTime? LastLoginAt { get; set; }  // Thời gian đăng nhập lần cuối (nullable)
        public int TotalSolved { get; set; }  // Tổng số bài tập đã giải quyết
        public int TotalSubmissions { get; set; }  // Tổng số bài tập đã nộp
        public DateTime? LastSolvedAt { get; set; }  // Thời gian giải quyết bài tập cuối cùng (nullable)
    }

}