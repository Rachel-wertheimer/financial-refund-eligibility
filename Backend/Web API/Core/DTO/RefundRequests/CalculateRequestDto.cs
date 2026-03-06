using Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTO.RefundRequests
{
    public class CalculateRequestDto
    {
        [Required(ErrorMessage = "ClerkId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "ClerkId must be greater than 0")]
        public int ClerkId { get; set; }

        [Required(ErrorMessage = "Approve is required")]
        public bool Approve { get; set; }
    }
}
