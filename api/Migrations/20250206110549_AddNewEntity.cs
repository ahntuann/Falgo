using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddNewEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                    { "172e8392-ffed-43b0-94ad-33aedd0a621c", null, "Admin", "ADMIN" },
                    { "b4a6924b-19b0-4d75-a20f-bebbbf37cce3", null, "Guest", "GUEST" },
                    { "f878941f-7803-4278-a015-48312601625a", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "172e8392-ffed-43b0-94ad-33aedd0a621c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b4a6924b-19b0-4d75-a20f-bebbbf37cce3");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f878941f-7803-4278-a015-48312601625a");

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
    }
}
