using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Citizen
    {

        public int CitizenId { get; set; }
        public string IdentityNumber { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public ICollection<MonthlyIncome> MonthlyIncomes { get; set; } = new List<MonthlyIncome>();
        public ICollection<RefundRequest> RefundRequests { get; set; } = new List<RefundRequest>();

    }
}
