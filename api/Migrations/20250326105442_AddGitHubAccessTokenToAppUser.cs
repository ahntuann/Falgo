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
                keyValue: "88576871-3a5b-492e-b3dd-f45909ee620d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8fbb1a48-5d93-4cd6-94e6-3de3d1954c68");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ffd3a3e8-2411-4f3a-b9ef-94878a6cd18e");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "0ea0411c-9bb8-4d36-8161-2db67bd36a90", null, "Admin", "ADMIN" },
                    { "3b644a5a-a361-49af-879b-db4ab34beee8", null, "Guest", "GUEST" },
                    { "6f579bd5-5db6-4ac2-b1cf-fd78d62a6e7c", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0ea0411c-9bb8-4d36-8161-2db67bd36a90");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3b644a5a-a361-49af-879b-db4ab34beee8");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6f579bd5-5db6-4ac2-b1cf-fd78d62a6e7c");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "88576871-3a5b-492e-b3dd-f45909ee620d", null, "Guest", "GUEST" },
                    { "8fbb1a48-5d93-4cd6-94e6-3de3d1954c68", null, "User", "USER" },
                    { "ffd3a3e8-2411-4f3a-b9ef-94878a6cd18e", null, "Admin", "ADMIN" }
                });
        }
    }
}
