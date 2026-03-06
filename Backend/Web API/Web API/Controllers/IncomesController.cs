using Core.DTO.MonthlyIncomes;
using Microsoft.AspNetCore.Mvc;
using Service.Service;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IncomesController : ControllerBase
    {
        private readonly MonthlyIncomeService _monthlyIncomeService;
        private readonly ILogger<IncomesController> _logger;

        public IncomesController(MonthlyIncomeService monthlyIncomeService, ILogger<IncomesController> logger)
        {
            _monthlyIncomeService = monthlyIncomeService;
            _logger = logger;
        }

        /// <summary>
        /// הוספת הכנסה חודשית
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateMonthlyIncomeDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var income = await _monthlyIncomeService.AddMonthlyIncomeAsync(
                    dto.CitizenId,
                    dto.TaxYear,
                    dto.Month,
                    dto.Amount);

                return Ok(income);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Monthly income already exists");
                return StatusCode((int)HttpStatusCode.Conflict, new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid income data");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating monthly income");
                return StatusCode((int)HttpStatusCode.InternalServerError,
                    new { message = "An error occurred while creating the monthly income." });
            }
        }

        /// <summary>
        /// שליפת הכנסות לפי שנה
        /// </summary>
        [HttpGet("{citizenId:int}/{taxYear:int}")]
        public async Task<ActionResult<List<MonthlyIncomeDto>>> GetByYear(int citizenId, int taxYear)
        {
            if (citizenId <= 0)
            {
                return BadRequest(new { message = "Invalid citizenId." });
            }

            if (taxYear < 2000 || taxYear > 2100)
            {
                return BadRequest(new { message = "Invalid taxYear." });
            }

            try
            {
                var incomes = await _monthlyIncomeService.GetIncomesByYearAsync(citizenId, taxYear);
                return Ok(incomes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting monthly incomes");
                return StatusCode((int)HttpStatusCode.InternalServerError,
                    new { message = "An error occurred while retrieving monthly incomes." });
            }
        }
    }
}

