using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StackExchange.Redis;

namespace api.Extensions
{
    public class RedisService
    {
        private readonly IDatabase _db;

        public RedisService()
        {
            ConnectionMultiplexer redis = ConnectionMultiplexer.Connect("localhost");
            _db = redis.GetDatabase();
        }
        public async Task SetOtpAsync(string email, string otp)
        {
            await _db.StringSetAsync(email, otp, TimeSpan.FromSeconds(90)); // Lưu OTP 90 giây
        }

        public async Task<string> GetOtpAsync(string email)
        {
            return await _db.StringGetAsync(email);
        }

        public async Task<bool> VerifyOtpAsync(string email, string otp)
        {
            var savedOtp = await _db.StringGetAsync(email);
            return savedOtp == otp;
        }

    }
}