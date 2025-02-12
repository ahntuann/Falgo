using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class _1608newDateBase11022025 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                    { "2916b2c5-72d1-4bbc-8ab2-71700347dfc6", null, "Admin", "ADMIN" },
                    { "67c4edb6-6706-4e26-a1f9-c1fd766c0f97", null, "User", "USER" },
                    { "b6351a86-e579-4676-9d74-24e04665b837", null, "Guest", "GUEST" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2916b2c5-72d1-4bbc-8ab2-71700347dfc6");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "67c4edb6-6706-4e26-a1f9-c1fd766c0f97");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b6351a86-e579-4676-9d74-24e04665b837");

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
    }
}
