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

        public async Task<Blog> CreateAsync(Blog BlogModel)
        {
            await _Context.Blogs.AddAsync(BlogModel);
            await _Context.SaveChangesAsync();
            return BlogModel;
        }

        public async Task<List<Blog>> GetAllAsync()
        {
            return await _Context.Blogs.ToListAsync();
        }

        public async Task<Blog?> GetByIDAsync(int id)
        {
            return await _Context.Blogs.FirstOrDefaultAsync(i => i.ID == id);
        }
    }
}