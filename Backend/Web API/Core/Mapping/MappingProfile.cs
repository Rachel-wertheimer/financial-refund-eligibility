using AutoMapper;
using Core.DTO.Budgets;
using Core.DTO.Citizens;
using Core.DTO.MonthlyIncomes;
using Core.DTO.RefundRequests;
using Core.Entities;

namespace Core.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Refund requests
            CreateMap<RefundRequest, RefundRequestDto>().ReverseMap();

            // Citizens
            CreateMap<Citizen, CitizenDto>().ReverseMap();

            // Monthly incomes
            CreateMap<MonthlyIncome, MonthlyIncomeDto>().ReverseMap();

            // Budgets
            CreateMap<MonthlyBudget, MonthlyBudgetDto>()
                .ForMember(d => d.AvailableBudget, opt => opt.MapFrom(s => s.AvailableBudget))
                .ReverseMap()
                .ForMember(d => d.AvailableBudget, opt => opt.Ignore()); // Ignore computed property in reverse mapping
        }
    }
}
