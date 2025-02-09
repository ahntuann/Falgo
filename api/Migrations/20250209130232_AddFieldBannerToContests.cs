using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddFieldBannerToContests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<string>(
                name: "Banner",
                table: "Contests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "4558eff9-626e-45b1-ac71-a06760d47509", null, "Guest", "GUEST" },
                    { "9ef03920-fedc-46b4-acb0-1ef5b3085cf8", null, "User", "USER" },
                    { "ca7529d7-2874-4c84-981f-a71d22f92d78", null, "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4558eff9-626e-45b1-ac71-a06760d47509");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9ef03920-fedc-46b4-acb0-1ef5b3085cf8");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ca7529d7-2874-4c84-981f-a71d22f92d78");

            migrationBuilder.DropColumn(
                name: "Banner",
                table: "Contests");

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
    }
}
