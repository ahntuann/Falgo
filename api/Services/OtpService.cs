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
                AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(180) // Lưu OTP trong 180 giây
            };
            _cache.Set(email, otp, cacheEntryOptions);
        }

        public string GetOtp(string email)
        {
            _cache.TryGetValue(email, out string otp);
            return otp;
        }

        public void DeleteOtp(string email)
        {
            _cache.Remove(email);
        }
    }
}