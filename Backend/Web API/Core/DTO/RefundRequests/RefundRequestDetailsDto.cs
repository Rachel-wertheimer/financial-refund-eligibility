using System;
using System.Collections.Generic;

namespace Core.DTO.RefundRequests
{
    public class RefundRequestDetailsDto
    {
        public RefundRequestDto Request { get; set; } = new RefundRequestDto();
        public CitizenInRequestDto Citizen { get; set; } = new CitizenInRequestDto();
        public List<IncomeYearGroupDto> IncomesByYear { get; set; } = new List<IncomeYearGroupDto>();
        public List<PastRefundRequestDto> PastRequests { get; set; } = new List<PastRefundRequestDto>();
    }

    public class CitizenInRequestDto
    {
        public int CitizenId { get; set; }
        public string IdentityNumber { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
    }

    public class IncomeYearGroupDto
    {
        public int TaxYear { get; set; }
        public List<IncomeMonthAmountDto> MonthlyIncomes { get; set; } = new List<IncomeMonthAmountDto>();
    }

    public class IncomeMonthAmountDto
    {
        public int Month { get; set; }
        public decimal Amount { get; set; }
    }

    public class PastRefundRequestDto
    {
        public int Id { get; set; }
        public int TaxYear { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal? ApprovedAmount { get; set; }
    }
}

