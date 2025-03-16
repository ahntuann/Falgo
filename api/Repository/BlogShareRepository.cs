using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interface.Repository;
using api.Model;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class BlogShareRepository : IBlogShareRepository
    {
        private readonly ApplicationDBContext _Context;
        public BlogShareRepository(ApplicationDBContext Context)
        {
            _Context = Context;
        }

        public async Task<List<BlogShare>> GetAllAsync()
        {
            return await _Context.BlogShare.ToListAsync();
        }
        public async Task<BlogShare> CreateAsync(BlogShare Content)
        {
            await _Context.BlogShare.AddAsync(Content);
            await _Context.SaveChangesAsync();
            return Content;
        }
    }
}