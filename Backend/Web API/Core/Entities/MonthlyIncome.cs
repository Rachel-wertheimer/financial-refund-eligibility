using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class MonthlyIncome
    {
        public int Id { get; set; }

        public int CitizenId { get; set; }
        public Citizen Citizen { get; set; }

        public int TaxYear { get; set; }
        public int Month { get; set; }

        public decimal Amount { get; set; }
    }
}
