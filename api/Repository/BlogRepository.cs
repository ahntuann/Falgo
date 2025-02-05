using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interface;
using api.Model;
using api.Model.BlogSpace;
using Microsoft.EntityFrameworkCore;


namespace api.Repository
{
    public class BlogRepository : IBlogRepository
    {
        private readonly ApplicationDBContext _Context;
        public BlogRepository(ApplicationDBContext Context)
        {
            _Context = Context;
        }

        public async Task<List<Blog>> GetAllAsync()
        {
            return await _Context.Blogs.ToListAsync();
        }
    }
}