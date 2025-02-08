using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class newEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "064579e0-7b4d-4b70-9793-82c7a6e54d8c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "89f1ce15-26fe-47fe-92de-8d633f5bf7b5");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c2b895c5-6a1c-47d8-a97e-75f35eebc778");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "88786048-9f7d-45b2-9b0e-32808d4c7418", null, "Admin", "ADMIN" },
                    { "8a1c41a3-0987-40d1-b736-056e503ff696", null, "User", "USER" },
                    { "e5b2d12b-131c-4b59-97f3-6e7db8b43d62", null, "Guest", "GUEST" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "88786048-9f7d-45b2-9b0e-32808d4c7418");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8a1c41a3-0987-40d1-b736-056e503ff696");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e5b2d12b-131c-4b59-97f3-6e7db8b43d62");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "064579e0-7b4d-4b70-9793-82c7a6e54d8c", null, "Guest", "GUEST" },
                    { "89f1ce15-26fe-47fe-92de-8d633f5bf7b5", null, "Admin", "ADMIN" },
                    { "c2b895c5-6a1c-47d8-a97e-75f35eebc778", null, "User", "USER" }
                });
        }
    }
}
