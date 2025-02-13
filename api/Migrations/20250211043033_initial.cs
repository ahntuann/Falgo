using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
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
                    { "3532d108-f407-40dc-84a8-c68d5701dc87", null, "User", "USER" },
                    { "55f88524-bf26-4516-91b7-d9800bd60242", null, "Guest", "GUEST" },
                    { "d838051f-64c3-4226-bfa8-a62477badd77", null, "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3532d108-f407-40dc-84a8-c68d5701dc87");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "55f88524-bf26-4516-91b7-d9800bd60242");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d838051f-64c3-4226-bfa8-a62477badd77");

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
