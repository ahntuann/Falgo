using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Threading.Tasks;
using api.Dtos.BlogSpace;
using api.Model;
using api.Model.BlogSpace;

namespace api.Interface
{
    public interface IBlogRepository
    {
        Task<List<Blog>> GetAllAsync();
        Task<Blog?> GetByIDAsync(int id);
        Task<Blog> CreateAsync(Blog BlogModel);
        Task<Blog?> UpdateAync(int id, UpdateBlogRequesDto BlogDto);
        Task<Blog?> DeleteAync(int id);
    }
}