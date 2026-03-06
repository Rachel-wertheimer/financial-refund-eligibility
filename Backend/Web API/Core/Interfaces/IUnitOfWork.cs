using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IUnitOfWork
    {
        IRepository<RefundRequest, int> RefundRequests { get; }
        IRepository<Citizen, int> Citizens { get; }
        IRepository<MonthlyIncome, int> MonthlyIncomes { get; }
        IRepository<MonthlyBudget, int> MonthlyBudgets { get; }
        IRepository<ClerkDecision, int> ClerkDecisions { get; }
        IRepository<Clerk, int> Clerks { get; }

        Task SaveAsync();

    }
}
