using Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class RefundRequest
    {
        public int Id { get; set; }

        public int CitizenId { get; set; }
        public Citizen? Citizen { get; set; }

        public int TaxYear { get; set; }
        public RequestStatus Status { get; set; }
        public decimal? CalculatedAmount { get; set; }
        public decimal? ApprovedAmount { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? CalculatedAt { get; set; }
        public DateTime? DecidedAt { get; set; }

        public ICollection<ClerkDecision> ClerkDecisions { get; set; } = new List<ClerkDecision>();

        [Timestamp]
        public byte[]? RowVersion { get; set; }
        
        public RefundRequest()
        {
            Status = RequestStatus.Pending;
        }
    }
}
