using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos;
using api.Dtos.BlogSpace;
using api.Model;

namespace api.Mappers
{
    public static class BlogMapper
    {
        public static BlogDto ToBlogDto(this Blog BlogModel)
        {
            return new BlogDto
            {
                ID = BlogModel.ID,

                UserId = BlogModel.UserId,

                GuestName = BlogModel.GuestName,
                GuestEmail = BlogModel.GuestEmail,

                Thumbnail = BlogModel.Thumbnail,
                title = BlogModel.title,
                description = BlogModel.description,
                Content = BlogModel.Content,
                ImageBlog = BlogModel.ImageBlog,
                CategoryBlog = BlogModel.CategoryBlog,
                Status = BlogModel.Status,

                CreateOn = BlogModel.CreateOn,
                DatePublic = BlogModel.DatePublic,
                TagBlog = BlogModel.TagBlog
            };
        }
        public static Blog ToBlogFromCreateDto(this CreateBlogRequestDto BlogDto, string? userId)
        {
            return new Blog
            {
                UserId = userId,
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