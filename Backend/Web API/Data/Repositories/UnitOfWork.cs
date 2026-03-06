using Core.Entities;
using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly RefundDbContext _context;

        public IRepository<RefundRequest, int> RefundRequests { get; }
        public IRepository<Citizen, int> Citizens { get; }
        public IRepository<MonthlyIncome, int> MonthlyIncomes { get; }
        public IRepository<MonthlyBudget, int> MonthlyBudgets { get; }
        public IRepository<ClerkDecision, int> ClerkDecisions { get; }
        public IRepository<Clerk, int> Clerks { get; }

        public UnitOfWork(RefundDbContext context)
        {
            _context = context;
            RefundRequests = new Repository<RefundRequest, int>(_context);
            Citizens = new Repository<Citizen, int>(_context);
            MonthlyIncomes = new Repository<MonthlyIncome, int>(_context);
            MonthlyBudgets = new Repository<MonthlyBudget, int>(_context);
            ClerkDecisions = new Repository<ClerkDecision, int>(_context);
            Clerks = new Repository<Clerk, int>(_context);
        }

        public async Task SaveAsync() => await _context.SaveChangesAsync();
    }
}
