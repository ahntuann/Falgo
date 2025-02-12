using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ac56008f-2070-4160-9b0f-93767e3606ab");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b009e43d-cfc1-429e-8d2f-cd3872189665");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "fb25f9aa-218b-496b-9217-2aedb9bc8904");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "4df76368-2d2e-45f6-914e-468eaf51681c", null, "Admin", "ADMIN" },
                    { "4fdcc797-b056-4bb9-ab60-24735e9a38ab", null, "Guest", "GUEST" },
                    { "9d8011c8-185a-407e-bc25-8bb1a0cbff39", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4df76368-2d2e-45f6-914e-468eaf51681c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4fdcc797-b056-4bb9-ab60-24735e9a38ab");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9d8011c8-185a-407e-bc25-8bb1a0cbff39");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "ac56008f-2070-4160-9b0f-93767e3606ab", null, "Guest", "GUEST" },
                    { "b009e43d-cfc1-429e-8d2f-cd3872189665", null, "Admin", "ADMIN" },
                    { "fb25f9aa-218b-496b-9217-2aedb9bc8904", null, "User", "USER" }
                });
        }
    }
}
