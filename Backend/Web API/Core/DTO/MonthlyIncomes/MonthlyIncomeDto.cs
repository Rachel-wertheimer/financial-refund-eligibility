using System.ComponentModel.DataAnnotations;

namespace Core.DTO.MonthlyIncomes
{
    public class MonthlyIncomeDto
    {
        public int Id { get; set; }

        public int CitizenId { get; set; }

        public int TaxYear { get; set; }

        public int Month { get; set; }

        public decimal Amount { get; set; }
    }
}

