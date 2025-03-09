using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;

namespace api.Services
{
    public class OtpService
    {
        private readonly IMemoryCache _cache;

        public OtpService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public void SetOtp(string email, string otp)
        {
            var cacheEntryOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(90) 
            };
            _cache.Set(email, otp, cacheEntryOptions);
            Console.WriteLine($"[DEBUG] OTP mới cho {email}: {otp}");
        }

        public string GetOtp(string email)
        {
            if (_cache.TryGetValue(email, out string otp))
            {
            Console.WriteLine($"[DEBUG] OTP hiện tại cho {email}: {otp}");
            return otp;
            }
            Console.WriteLine($"[DEBUG] Không tìm thấy OTP cho {email}");
            return null;
        }

        public void DeleteOtp(string email)
        {
            _cache.Remove(email);
        }
    }
}