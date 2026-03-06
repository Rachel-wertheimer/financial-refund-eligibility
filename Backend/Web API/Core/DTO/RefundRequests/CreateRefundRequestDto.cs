using Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTO.RefundRequests
{
    public class CreateRefundRequestDto
    {
        [Required(ErrorMessage = "CitizenId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "CitizenId must be greater than 0")]
        public int CitizenId { get; set; }

        [Required(ErrorMessage = "TaxYear is required")]
        [Range(2000, 2100, ErrorMessage = "TaxYear must be between 2000 and 2100")]
        public int TaxYear { get; set; }
    }
}
