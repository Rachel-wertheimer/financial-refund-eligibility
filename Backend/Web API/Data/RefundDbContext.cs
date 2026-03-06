using Core.Entities;
using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Data
{
    public class RefundDbContext : DbContext
    {
        public DbSet<Citizen> Citizens { get; set; }
        public DbSet<Clerk> Clerks { get; set; }
        public DbSet<ClerkDecision> ClerkDecisions { get; set; }
        public DbSet<MonthlyBudget> MonthlyBudgets { get; set; }
        public DbSet<MonthlyIncome> MonthlyIncomes { get; set; }
        public DbSet<RefundRequest> RefundRequests { get; set; }

        public RefundDbContext(DbContextOptions<RefundDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // =====================================================
            // Citizen
            // =====================================================
            modelBuilder.Entity<Citizen>(entity =>
            {
                entity.HasKey(c => c.CitizenId);

                entity.Property(c => c.IdentityNumber)
                      .IsRequired()
                      .HasMaxLength(20);

                entity.HasIndex(c => c.IdentityNumber)
                      .IsUnique();

                entity.Property(c => c.FullName)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(c => c.CreatedAt)
                      .HasDefaultValueSql("GETDATE()")
                      .IsRequired();
            });

            // =====================================================
            // Clerk
            // =====================================================
            modelBuilder.Entity<Clerk>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.Property(c => c.Username)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.HasIndex(c => c.Username)
                      .IsUnique();

                entity.Property(c => c.PasswordHash)
                      .IsRequired()
                      .HasMaxLength(500);

                entity.Property(c => c.CreatedAt)
                      .HasDefaultValueSql("GETDATE()")
                      .IsRequired();
            });

            // =====================================================
            // MonthlyIncome
            // =====================================================
            modelBuilder.Entity<MonthlyIncome>(entity =>
            {
                entity.HasKey(m => m.Id);

                entity.Property(m => m.Amount)
                      .HasColumnType("decimal(18,2)")
                      .IsRequired();

                entity.ToTable(t => t.HasCheckConstraint(
                    "CK_MonthlyIncome_Amount_Positive",
                    "[Amount] >= 0"));

                entity.ToTable(t => t.HasCheckConstraint(
                    "CK_MonthlyIncome_Month",
                    "[Month] BETWEEN 1 AND 12"));

                entity.HasIndex(m => new { m.CitizenId, m.TaxYear, m.Month })
                      .IsUnique();

                entity.HasIndex(m => new { m.CitizenId, m.TaxYear });

                entity.HasOne(m => m.Citizen)
                      .WithMany(c => c.MonthlyIncomes)
                      .HasForeignKey(m => m.CitizenId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // =====================================================
            // RefundRequest
            // =====================================================
            modelBuilder.Entity<RefundRequest>(entity =>
            {
                entity.HasKey(r => r.Id);


        //        entity.Property(r => r.Status)
        //.HasConversion<int>()
        //.HasDefaultValue((int)RequestStatus.Pending)
        //.IsRequired();

                entity.Property(r => r.CalculatedAmount)
                      .HasColumnType("decimal(18,2)");

                entity.Property(r => r.ApprovedAmount)
                      .HasColumnType("decimal(18,2)");

                entity.Property(r => r.CreatedAt)
                      .HasDefaultValueSql("GETDATE()")
                      .IsRequired();

                entity.Property(r => r.RowVersion)
                      .IsRowVersion();

                // מניעת שתי בקשות לאותה שנה
                entity.HasIndex(r => new { r.CitizenId, r.TaxYear })
                      .IsUnique();

                entity.HasIndex(r => r.Status);
                entity.HasIndex(r => r.CitizenId);

                entity.HasOne(r => r.Citizen)
                      .WithMany(c => c.RefundRequests)
                      .HasForeignKey(r => r.CitizenId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // =====================================================
            // ClerkDecision
            // =====================================================
            modelBuilder.Entity<ClerkDecision>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.Property(c => c.Decision)
                      .IsRequired();

                entity.Property(c => c.ApprovedAmount)
                      .HasColumnType("decimal(18,2)")
                      .IsRequired();

                entity.Property(c => c.DecisionDate)
                      .HasDefaultValueSql("GETDATE()")
                      .IsRequired();

                entity.HasOne(c => c.RefundRequest)
                      .WithMany(r => r.ClerkDecisions)
                      .HasForeignKey(c => c.RequestId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // =====================================================
            // MonthlyBudget
            // =====================================================
            modelBuilder.Entity<MonthlyBudget>(entity =>
            {
                entity.HasKey(b => b.Id);

                entity.Property(b => b.TotalBudget)
                      .HasColumnType("decimal(18,2)")
                      .IsRequired();

                entity.Property(b => b.UsedBudget)
                      .HasColumnType("decimal(18,2)")
                      .IsRequired()
                      .HasDefaultValue(0);

                entity.Property(b => b.RowVersion)
                      .IsRowVersion();

                entity.HasIndex(b => new { b.Year, b.Month })
                      .IsUnique();

                entity.ToTable(t => t.HasCheckConstraint(
                    "CK_MonthlyBudget_Month",
                    "[Month] BETWEEN 1 AND 12"));

                entity.ToTable(t => t.HasCheckConstraint(
                    "CK_MonthlyBudget_Total_Positive",
                    "[TotalBudget] >= 0"));

                entity.ToTable(t => t.HasCheckConstraint(
                    "CK_MonthlyBudget_Used_Not_Negative",
                    "[UsedBudget] >= 0"));

                entity.ToTable(t => t.HasCheckConstraint(
                    "CK_MonthlyBudget_Not_Over_Allocated",
                    "[UsedBudget] <= [TotalBudget]"));
            });
        }
    }
}

