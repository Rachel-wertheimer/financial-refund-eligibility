using System;
using System.Collections.Generic;
using Core.DTO.RefundRequests;

namespace Core.DTO.Citizens
{
    public class CitizenSummaryDto
    {
        public CitizenDto Citizen { get; set; } = new CitizenDto();
        public RefundRequestDto? LastRequest { get; set; }
        public List<PastRefundRequestDto> History { get; set; } = new List<PastRefundRequestDto>();
    }
}

