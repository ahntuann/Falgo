using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Threading.Tasks;
using api.Dtos.BlogSpace;
using api.Model;

namespace api.Interface
{
    public interface IBlogRepository
    {
        Task<List<Blog>> GetAllAsync();
        Task<Blog?> GetByIDAsync(int id);
        Task<List<Blog>> GetByUserIDAsync(string id);
        Task<Blog> CreateAsync(Blog BlogModel);
        Task<Blog?> UpdateAync(int id, UpdateBlogRequesDto BlogDto);
        Task<Blog?> DeleteAync(int id);
    }
}