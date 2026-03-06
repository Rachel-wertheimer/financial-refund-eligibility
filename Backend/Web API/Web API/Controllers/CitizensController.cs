using Core.DTO.Citizens;
using Microsoft.AspNetCore.Mvc;
using Service.Service;
using System;
using System.Net;
using System.Threading.Tasks;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CitizensController : ControllerBase
    {
        private readonly CitizenService _citizenService;
        private readonly ILogger<CitizensController> _logger;

        public CitizensController(CitizenService citizenService, ILogger<CitizensController> logger)
        {
            _citizenService = citizenService;
            _logger = logger;
        }

        /// <summary>
      /// יצירת אזרח חדש
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCitizenDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var citizen = await _citizenService.CreateCitizenAsync(dto.IdentityNumber, dto.FullName);
                return Ok(citizen);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Citizen already exists");
                return StatusCode((int)HttpStatusCode.Conflict, new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid citizen data");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating citizen");
                return StatusCode((int)HttpStatusCode.InternalServerError,
                    new { message = "An error occurred while creating the citizen." });
            }
        }

        /// <summary>
        /// מסך אזרח – שליפה לפי ת\"ז כולל בקשה אחרונה והיסטוריית בקשות
        /// </summary>
        [HttpGet("by-identity/{identityNumber}")]
        public async Task<IActionResult> GetByIdentity(string identityNumber)
        {
            if (string.IsNullOrWhiteSpace(identityNumber))
            {
                return BadRequest(new { message = "IdentityNumber is required." });
            }

            try
            {
                var summary = await _citizenService.GetCitizenSummaryByIdentityAsync(identityNumber);
                return Ok(summary);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Citizen not found");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting citizen summary");
                return StatusCode((int)HttpStatusCode.InternalServerError,
                    new { message = "An error occurred while retrieving citizen summary." });
            }
        }
    }
}

