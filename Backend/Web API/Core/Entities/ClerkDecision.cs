using Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class ClerkDecision
    {

        public int Id { get; set; }

        public int RequestId { get; set; }
        public RefundRequest? RefundRequest { get; set; }

        public int ClerkId { get; set; }

        public DecisionType Decision { get; set; }

        public decimal ApprovedAmount { get; set; }

        public DateTime DecisionDate { get; set; }

    }
}
