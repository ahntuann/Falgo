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
                    { "2fc5ba53-7a1f-41a4-b1a1-55b5db544ad1", null, "Admin", "ADMIN" },
                    { "69f38803-1b1b-4fdd-8015-88f3f7697a21", null, "Guest", "GUEST" },
                    { "da47625f-8f4c-4450-9431-4e4f3f481f70", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2fc5ba53-7a1f-41a4-b1a1-55b5db544ad1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "69f38803-1b1b-4fdd-8015-88f3f7697a21");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "da47625f-8f4c-4450-9431-4e4f3f481f70");

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
