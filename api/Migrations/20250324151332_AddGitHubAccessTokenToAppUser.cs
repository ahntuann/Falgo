using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddGitHubAccessTokenToAppUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0682dde4-476a-4f2a-a337-bb851b64456c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0e60e260-c078-43a9-9987-64fe89e389e9");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4d5f9fc5-e8b3-4d32-81dd-8f445f7e1b8d");

            migrationBuilder.AddColumn<string>(
                name: "GitHubAccessToken",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "57e57e7d-c69e-4e53-b9a7-e7bf3da3fbd1", null, "Admin", "ADMIN" },
                    { "863550a6-dc3e-43f8-9d0b-cbd9ed620477", null, "User", "USER" },
                    { "cf87b808-063d-4c1a-8b5a-618e3c2707a3", null, "Guest", "GUEST" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "57e57e7d-c69e-4e53-b9a7-e7bf3da3fbd1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "863550a6-dc3e-43f8-9d0b-cbd9ed620477");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cf87b808-063d-4c1a-8b5a-618e3c2707a3");

            migrationBuilder.DropColumn(
                name: "GitHubAccessToken",
                table: "AspNetUsers");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "0682dde4-476a-4f2a-a337-bb851b64456c", null, "Guest", "GUEST" },
                    { "0e60e260-c078-43a9-9987-64fe89e389e9", null, "Admin", "ADMIN" },
                    { "4d5f9fc5-e8b3-4d32-81dd-8f445f7e1b8d", null, "User", "USER" }
                });
        }
    }
}
