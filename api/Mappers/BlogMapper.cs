using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos;
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
                CreateOn = BlogModel.CreateOn,
                Status = BlogModel.Status
            };
        }
        public static Blog ToBlogFromCreateDto(this CreateBlogRequestDto BlogDto)
        {
            return new Blog
            {
                GuestName = BlogDto.GuestName,
                GuestEmail = BlogDto.GuestEmail,
                Thumbnail = BlogDto.Thumbnail,
                title = BlogDto.title,
                description = BlogDto.description,
                Content = BlogDto.Content,
                Status = BlogDto.Status,
                CreateOn = BlogDto.CreateOn,
                DatePublic = BlogDto.DatePublic,
            };
        }
    }
}