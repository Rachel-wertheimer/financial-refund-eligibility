using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class updateDataConstrainsFainlly : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_MonthlyBudget_UsedBudget",
                table: "MonthlyBudgets");

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "RefundRequests",
                type: "rowversion",
                rowVersion: true,
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AlterColumn<decimal>(
                name: "UsedBudget",
                table: "MonthlyBudgets",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<string>(
                name: "IdentityNumber",
                table: "Citizens",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(9)",
                oldMaxLength: 9);

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "Citizens",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.CreateIndex(
                name: "IX_RefundRequests_CitizenId_TaxYear",
                table: "RefundRequests",
                columns: new[] { "CitizenId", "TaxYear" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RefundRequests_Status",
                table: "RefundRequests",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_MonthlyIncomes_CitizenId_TaxYear",
                table: "MonthlyIncomes",
                columns: new[] { "CitizenId", "TaxYear" });

            migrationBuilder.AddCheckConstraint(
                name: "CK_MonthlyIncome_Amount_Positive",
                table: "MonthlyIncomes",
                sql: "[Amount] >= 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_MonthlyBudget_Not_Over_Allocated",
                table: "MonthlyBudgets",
                sql: "[UsedBudget] <= [TotalBudget]");

            migrationBuilder.AddCheckConstraint(
                name: "CK_MonthlyBudget_Total_Positive",
                table: "MonthlyBudgets",
                sql: "[TotalBudget] >= 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_MonthlyBudget_Used_Not_Negative",
                table: "MonthlyBudgets",
                sql: "[UsedBudget] >= 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RefundRequests_CitizenId_TaxYear",
                table: "RefundRequests");

            migrationBuilder.DropIndex(
                name: "IX_RefundRequests_Status",
                table: "RefundRequests");

            migrationBuilder.DropIndex(
                name: "IX_MonthlyIncomes_CitizenId_TaxYear",
                table: "MonthlyIncomes");

            migrationBuilder.DropCheckConstraint(
                name: "CK_MonthlyIncome_Amount_Positive",
                table: "MonthlyIncomes");

            migrationBuilder.DropCheckConstraint(
                name: "CK_MonthlyBudget_Not_Over_Allocated",
                table: "MonthlyBudgets");

            migrationBuilder.DropCheckConstraint(
                name: "CK_MonthlyBudget_Total_Positive",
                table: "MonthlyBudgets");

            migrationBuilder.DropCheckConstraint(
                name: "CK_MonthlyBudget_Used_Not_Negative",
                table: "MonthlyBudgets");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "RefundRequests");

            migrationBuilder.AlterColumn<decimal>(
                name: "UsedBudget",
                table: "MonthlyBudgets",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldDefaultValue: 0m);

            migrationBuilder.AlterColumn<string>(
                name: "IdentityNumber",
                table: "Citizens",
                type: "nvarchar(9)",
                maxLength: 9,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "Citizens",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AddCheckConstraint(
                name: "CK_MonthlyBudget_UsedBudget",
                table: "MonthlyBudgets",
                sql: "[UsedBudget] <= [TotalBudget]");
        }
    }
}
