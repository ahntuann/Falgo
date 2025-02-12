using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class newDateBase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "034d052b-feed-4cf8-a015-cc8ee5ef963e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3bf736ed-866a-4abf-8efa-2b972e85d957");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3f84f18c-d882-400b-9ba9-6b514bc4e9e7");

            migrationBuilder.AlterColumn<string>(
                name: "description",
                table: "Blogs",
                type: "nvarchar(1)",
                maxLength: 1,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "a44c71f9-bedc-45de-8953-1e8495bcbf8f", null, "Admin", "ADMIN" },
                    { "e54da266-cf0b-4e70-842b-f828901cf5de", null, "Guest", "GUEST" },
                    { "fee44f6a-3286-47d5-9c09-247579c4744c", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a44c71f9-bedc-45de-8953-1e8495bcbf8f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e54da266-cf0b-4e70-842b-f828901cf5de");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "fee44f6a-3286-47d5-9c09-247579c4744c");

            migrationBuilder.AlterColumn<string>(
                name: "description",
                table: "Blogs",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1)",
                oldMaxLength: 1);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "034d052b-feed-4cf8-a015-cc8ee5ef963e", null, "Admin", "ADMIN" },
                    { "3bf736ed-866a-4abf-8efa-2b972e85d957", null, "Guest", "GUEST" },
                    { "3f84f18c-d882-400b-9ba9-6b514bc4e9e7", null, "User", "USER" }
                });
        }
    }
}
