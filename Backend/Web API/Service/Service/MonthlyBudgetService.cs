using AutoMapper;
using Core.DTO.Budgets;
using Core.Entities;
using Core.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Service.Service
{
    public class MonthlyBudgetService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public MonthlyBudgetService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<MonthlyBudgetDto?> GetMonthlyBudgetAsync(int year, int month)
        {
            var budgets = await _unitOfWork.MonthlyBudgets.GetAllAsync();

            var budget = budgets.FirstOrDefault(b => b.Year == year && b.Month == month);
            if (budget == null)
            {
                return null;
            }

            return _mapper.Map<MonthlyBudgetDto>(budget);
        }
    }
}
