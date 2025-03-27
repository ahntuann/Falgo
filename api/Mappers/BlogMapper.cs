using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using api.Dtos;
using api.Dtos.BlogSpace;
using api.Model;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;

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
                Note = BlogModel.Note,
                CommentBlog = BlogModel.CommentBlog.Select(cmt => cmt.ToBlogCommentDto()).ToList(),
                BlogLike = BlogModel.BlogLike.Select(Like => Like.ToBlogLikeDto()).ToList(),
                BlogShare = BlogModel.BlogShare.Select(share => share.ToBlogShareDto()).ToList(),
                BlogBookmark = BlogModel.BlogBookmark.Select(Bookmark => Bookmark.ToBlogBookmarkDto()).ToList()

            };
        }

        public static BlogForbiddenWordDto ToBlogForbiddenWordDto(this BlogForbiddenWord Model)
        {
            return new BlogForbiddenWordDto
            {
                ID = Model.ID,
                Word = Model.Word,
                IsActive = Model.IsActive,
                action = Model.action,

            };
        }

        public static Blog ToBlogFromCreateDto(this CreateBlogRequestDto BlogDto)
        {
            return new Blog
            {
                UserId = BlogDto.UserId,
                GuestName = BlogDto.GuestName,
                GuestEmail = BlogDto.GuestEmail,
                Thumbnail = BlogDto.Thumbnail,
                title = BlogDto.title,
                description = BlogDto.description,
                Content = BlogDto.Content,
                ImageBlog = BlogDto.Content,
                CategoryBlog = BlogDto.CategoryBlog,
                Status = BlogDto.Status,
                CreateOn = BlogDto.CreateOn,
                DatePublic = BlogDto.DatePublic,
                Note = BlogDto.Note
            };
        }
        public static BlogLike ToBlogLikeFromCreateDto(this BlogLikeDto BlogLikeModel)
        {
            return new BlogLike
            {
                BlogID = BlogLikeModel.BlogID,
                UserID = BlogLikeModel.UserID,
                LikedOn = DateTime.Now
            };
        }
        public static BlogBookmark ToBlogBookmarkFromCreateDto(this BlogBookmarkDto BlogBookmarkModel)
        {
            return new BlogBookmark
            {
                BlogID = BlogBookmarkModel.BlogID,
                UserID = BlogBookmarkModel.UserID,
            };
        }
        public static BlogShare ToBlogShareFromCreateDto(this BlogShareDto BlogShareModel)
        {
            return new BlogShare
            {
                BlogID = BlogShareModel.BlogID,
                UserID = BlogShareModel.UserID,
                SharedPlatform = BlogShareModel.SharedPlatform,
                SharedOn = BlogShareModel.SharedOn
            };
        }
        public static CommentBlog ToCommentBlogFromCreateDto(this CreateCommentBlogRequestDto Model)
        {
            return new CommentBlog
            {
                Avatar = Model.Avatar,
                GuestName = Model.GuestName,
                content = Model.content,
                CreateOn = DateTime.Now,
                Status = Model.Status,
                Note = Model.Note,
                BlogId = Model.BlogId,
                UserId = Model.UserId
            };
        }
        public static BlogForbiddenWord ToBlogForbiddenWordFromCreateDto(this CreateUpdateBlogForbiddenWordRequestDto model)
        {
            return new BlogForbiddenWord
            {
                Word = model.Word,
                IsActive = model.IsActive,
                action = model.action
            };
        }
        public static BlogCommentDto ToBlogCommentDto(this CommentBlog Model)
        {
            return new BlogCommentDto
            {
                ID = Model.ID,
                Avatar = Model.Avatar,
                GuestName = Model.GuestName,
                content = Model.content,
                CreateOn = DateTime.Now,
                Status = Model.Status,
                Note = Model.Note,

                BlogId = Model.BlogId,

                UserId = Model.UserId
            };
        }
        public static BlogLikeDto ToBlogLikeDto(this BlogLike Model)
        {
            return new BlogLikeDto
            {
                ID = Model.ID,
                BlogID = Model.BlogID,
                UserID = Model.UserID,
            };
        }
        public static BlogShareDto ToBlogShareDto(this BlogShare Model)
        {
            return new BlogShareDto
            {
                ID = Model.ID,
                BlogID = Model.BlogID,
                UserID = Model.UserID,
                SharedPlatform = Model.SharedPlatform,
                SharedOn = DateTime.Now
            };
        }
        public static BlogBookmarkDto ToBlogBookmarkDto(this BlogBookmark Model)
        {
            return new BlogBookmarkDto
            {
                ID = Model.ID,
                BlogID = Model.BlogID,
                UserID = Model.UserID,
            };
        }

    }
}