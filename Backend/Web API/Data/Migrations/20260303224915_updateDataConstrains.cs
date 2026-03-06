using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class updateDataConstrains : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClerkDecisions_RefundRequests_RefundRequestId",
                table: "ClerkDecisions");

            migrationBuilder.DropForeignKey(
                name: "FK_RefundRequests_Citizens_CitizenId",
                table: "RefundRequests");

            migrationBuilder.DropIndex(
                name: "IX_MonthlyIncomes_CitizenId",
                table: "MonthlyIncomes");

            migrationBuilder.DropIndex(
                name: "IX_ClerkDecisions_RefundRequestId",
                table: "ClerkDecisions");

            migrationBuilder.DropColumn(
                name: "RefundRequestId",
                table: "ClerkDecisions");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "RefundRequests",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DecisionDate",
                table: "ClerkDecisions",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<string>(
                name: "IdentityNumber",
                table: "Citizens",
                type: "nvarchar(9)",
                maxLength: 9,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "Citizens",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Citizens",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.CreateIndex(
                name: "IX_MonthlyIncomes_CitizenId_TaxYear_Month",
                table: "MonthlyIncomes",
                columns: new[] { "CitizenId", "TaxYear", "Month" },
                unique: true);

            migrationBuilder.AddCheckConstraint(
                name: "CK_MonthlyIncome_Month",
                table: "MonthlyIncomes",
                sql: "[Month] BETWEEN 1 AND 12");

            migrationBuilder.CreateIndex(
                name: "IX_MonthlyBudgets_Year_Month",
                table: "MonthlyBudgets",
                columns: new[] { "Year", "Month" },
                unique: true);

            migrationBuilder.AddCheckConstraint(
                name: "CK_MonthlyBudget_Month",
                table: "MonthlyBudgets",
                sql: "[Month] BETWEEN 1 AND 12");

            migrationBuilder.AddCheckConstraint(
                name: "CK_MonthlyBudget_UsedBudget",
                table: "MonthlyBudgets",
                sql: "[UsedBudget] <= [TotalBudget]");

            migrationBuilder.CreateIndex(
                name: "IX_ClerkDecisions_RequestId",
                table: "ClerkDecisions",
                column: "RequestId");

            migrationBuilder.CreateIndex(
                name: "IX_Citizens_IdentityNumber",
                table: "Citizens",
                column: "IdentityNumber",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ClerkDecisions_RefundRequests_RequestId",
                table: "ClerkDecisions",
                column: "RequestId",
                principalTable: "RefundRequests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RefundRequests_Citizens_CitizenId",
                table: "RefundRequests",
                column: "CitizenId",
                principalTable: "Citizens",
                principalColumn: "CitizenId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClerkDecisions_RefundRequests_RequestId",
                table: "ClerkDecisions");

            migrationBuilder.DropForeignKey(
                name: "FK_RefundRequests_Citizens_CitizenId",
                table: "RefundRequests");

            migrationBuilder.DropIndex(
                name: "IX_MonthlyIncomes_CitizenId_TaxYear_Month",
                table: "MonthlyIncomes");

            migrationBuilder.DropCheckConstraint(
                name: "CK_MonthlyIncome_Month",
                table: "MonthlyIncomes");

            migrationBuilder.DropIndex(
                name: "IX_MonthlyBudgets_Year_Month",
                table: "MonthlyBudgets");

            migrationBuilder.DropCheckConstraint(
                name: "CK_MonthlyBudget_Month",
                table: "MonthlyBudgets");

            migrationBuilder.DropCheckConstraint(
                name: "CK_MonthlyBudget_UsedBudget",
                table: "MonthlyBudgets");

            migrationBuilder.DropIndex(
                name: "IX_ClerkDecisions_RequestId",
                table: "ClerkDecisions");

            migrationBuilder.DropIndex(
                name: "IX_Citizens_IdentityNumber",
                table: "Citizens");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "RefundRequests",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETDATE()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DecisionDate",
                table: "ClerkDecisions",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETDATE()");

            migrationBuilder.AddColumn<int>(
                name: "RefundRequestId",
                table: "ClerkDecisions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "IdentityNumber",
                table: "Citizens",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(9)",
                oldMaxLength: 9);

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "Citizens",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Citizens",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETDATE()");

            migrationBuilder.CreateIndex(
                name: "IX_MonthlyIncomes_CitizenId",
                table: "MonthlyIncomes",
                column: "CitizenId");

            migrationBuilder.CreateIndex(
                name: "IX_ClerkDecisions_RefundRequestId",
                table: "ClerkDecisions",
                column: "RefundRequestId");

            migrationBuilder.AddForeignKey(
                name: "FK_ClerkDecisions_RefundRequests_RefundRequestId",
                table: "ClerkDecisions",
                column: "RefundRequestId",
                principalTable: "RefundRequests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RefundRequests_Citizens_CitizenId",
                table: "RefundRequests",
                column: "CitizenId",
                principalTable: "Citizens",
                principalColumn: "CitizenId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
