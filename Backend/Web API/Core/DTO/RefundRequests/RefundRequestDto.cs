using Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTO.RefundRequests
{
    public class RefundRequestDto
    {
        public int Id { get; set; }
        public int TaxYear { get; set; }
        public RequestStatus Status { get; set; }
    }
}
