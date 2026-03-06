using Core.DTO.Budgets;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Service;
using System;
using System.Net;
using System.Threading.Tasks;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BudgetController : ControllerBase
    {
        private readonly MonthlyBudgetService _monthlyBudgetService;
        private readonly ILogger<BudgetController> _logger;

        public BudgetController(MonthlyBudgetService monthlyBudgetService, ILogger<BudgetController> logger)
        {
            _monthlyBudgetService = monthlyBudgetService;
            _logger = logger;
        }

        /// <summary>
        /// שליפת תקציב חודשי
        /// </summary>
        [Authorize(Roles = "Clerk")]
        [HttpGet("{year:int}/{month:int}")]
        public async Task<ActionResult<MonthlyBudgetDto>> GetMonthlyBudget(int year, int month)
        {
            if (month < 1 || month > 12)
            {
                return BadRequest(new { message = "Invalid month. Must be between 1 and 12." });
            }

            try
            {
                var budget = await _monthlyBudgetService.GetMonthlyBudgetAsync(year, month);
                if (budget == null)
                {
                    return NotFound(new { message = "Budget not found for the specified year and month." });
                }

                return Ok(budget);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting monthly budget");
                return StatusCode((int)HttpStatusCode.InternalServerError,
                    new { message = "An error occurred while retrieving the monthly budget." });
            }
        }
    }
}

