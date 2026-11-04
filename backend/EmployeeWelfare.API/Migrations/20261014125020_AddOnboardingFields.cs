using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmployeeWelfare.API.Migrations
{
    /// <inheritdoc />
    public partial class AddOnboardingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "MustChangePassword",
                table: "Employees",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "OnboardingComplete",
                table: "Employees",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "TempPassword",
                table: "Employees",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MustChangePassword",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "OnboardingComplete",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "TempPassword",
                table: "Employees");
        }
    }
}
