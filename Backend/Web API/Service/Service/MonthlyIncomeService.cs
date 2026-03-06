using AutoMapper;
using Core.DTO.MonthlyIncomes;
using Core.Entities;
using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Service.Service
{
    public class MonthlyIncomeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public MonthlyIncomeService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<MonthlyIncomeDto> AddMonthlyIncomeAsync(int citizenId, int taxYear, int month, decimal amount)
        {
            if (month < 1 || month > 12)
                throw new ArgumentOutOfRangeException(nameof(month), "Month must be between 1 and 12.");

            if (amount < 0)
                throw new ArgumentOutOfRangeException(nameof(amount), "Amount must be non-negative.");

            // בדיקה שהאזרח קיים
            var citizen = await _unitOfWork.Citizens.GetByIdAsync(citizenId);
            if (citizen == null)
            {
                throw new ArgumentException($"Citizen with ID {citizenId} not found.");
            }

            // בדיקה שאין כבר רשומה לאותו חודש/שנה/אזרח
            var existingIncomes = await _unitOfWork.MonthlyIncomes.GetAllAsync();
            if (existingIncomes.Any(i =>
                i.CitizenId == citizenId &&
                i.TaxYear == taxYear &&
                i.Month == month))
            {
                throw new InvalidOperationException(
                    $"Monthly income for citizen {citizenId}, year {taxYear}, month {month} already exists.");
            }

            var income = new MonthlyIncome
            {
                CitizenId = citizenId,
                TaxYear = taxYear,
                Month = month,
                Amount = amount
            };

            await _unitOfWork.MonthlyIncomes.AddAsync(income);
            await _unitOfWork.SaveAsync();

            return _mapper.Map<MonthlyIncomeDto>(income);
        }

        public async Task<List<MonthlyIncomeDto>> GetIncomesByYearAsync(int citizenId, int taxYear)
        {
            var incomes = await _unitOfWork.MonthlyIncomes.GetAllAsync();

            var filtered = incomes
                .Where(i => i.CitizenId == citizenId && i.TaxYear == taxYear)
                .OrderBy(i => i.Month)
                .ToList();

            return _mapper.Map<List<MonthlyIncomeDto>>(filtered);
        }
    }
}
