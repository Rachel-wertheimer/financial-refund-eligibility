using System.ComponentModel.DataAnnotations;

namespace Core.DTO.MonthlyIncomes
{
    public class CreateMonthlyIncomeDto
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "CitizenId must be greater than 0")]
        public int CitizenId { get; set; }

        [Required]
        [Range(2000, 2100, ErrorMessage = "TaxYear must be between 2000 and 2100")]
        public int TaxYear { get; set; }

        [Required]
        [Range(1, 12, ErrorMessage = "Month must be between 1 and 12")]
        public int Month { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Amount must be positive")]
        public decimal Amount { get; set; }
    }
}

