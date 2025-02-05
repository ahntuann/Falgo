using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Problem;
using api.Model.BlogSpace;

namespace api.Mappers
{
    public static class BlogMapper
    {
        public static BlogDto ToBlogDto(this Blog BlogModel)
        {
            return new BlogDto
            {
                ID = BlogModel.ID,
                GuestName = BlogModel.GuestName,
                GuestEmail = BlogModel.GuestEmail,
                Thumbnail = BlogModel.Thumbnail,
                title = BlogModel.title,
                description = BlogModel.description,
                Content = BlogModel.Content,
                Status = BlogModel.Status
            };
        }
    }
}