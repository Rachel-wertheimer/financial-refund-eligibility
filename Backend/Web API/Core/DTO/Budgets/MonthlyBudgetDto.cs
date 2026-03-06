using System;

namespace Core.DTO.Budgets
{
    public class MonthlyBudgetDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal TotalBudget { get; set; }
        public decimal UsedBudget { get; set; }
        public decimal AvailableBudget { get; set; }
    }
}

