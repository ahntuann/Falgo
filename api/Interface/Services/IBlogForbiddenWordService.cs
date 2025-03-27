using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.BlogSpace;
using api.Model;

namespace api.Interface.Services
{
    public interface IBlogForbiddenWordService
    {
        Task<List<BlogForbiddenWord>> GetAllAsync();
        Task<BlogForbiddenWord?> GetByIDAsync(int id);
        Task<BlogForbiddenWord> CreateAsync(BlogForbiddenWord BlogModel);
        Task<BlogForbiddenWord?> UpdateAync(int id, CreateUpdateBlogForbiddenWordRequestDto BlogDto);
        Task<BlogForbiddenWord?> DeleteAync(int id);

    }
}