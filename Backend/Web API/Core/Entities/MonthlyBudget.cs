using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class MonthlyBudget
    {

        public int Id { get; set; }

        public int Year { get; set; }
        public int Month { get; set; }

        public decimal TotalBudget { get; set; }
        public decimal UsedBudget { get; set; }

        public decimal AvailableBudget => TotalBudget - UsedBudget;

        [Timestamp]
        public byte[] RowVersion { get; set; }

    }
}
