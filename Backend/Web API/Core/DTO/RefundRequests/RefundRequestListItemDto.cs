using System;

namespace Core.DTO.RefundRequests
{
    public class RefundRequestListItemDto
    {
        public int Id { get; set; }
        public int TaxYear { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public int CitizenId { get; set; }
        public string CitizenFullName { get; set; } = string.Empty;
        public string CitizenIdentityNumber { get; set; } = string.Empty;
    }
}

