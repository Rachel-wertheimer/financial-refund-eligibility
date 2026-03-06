using Core.DTO.RefundRequests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Service.Service;
using System.Net;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RefundRequestsController : ControllerBase
    {
        private readonly RefundRequestService _refundService;
        private readonly ILogger<RefundRequestsController> _logger;

        public RefundRequestsController(RefundRequestService refundService, ILogger<RefundRequestsController> logger)
        {
            _refundService = refundService;
            _logger = logger;
        }

        // יצירת בקשה
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRefundRequestDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var request = await _refundService.CreateRefundRequestAsync(dto.CitizenId, dto.TaxYear);
                return Ok(request);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid argument while creating refund request");
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Business rule violation while creating refund request");
                return StatusCode((int)HttpStatusCode.Conflict, new { message = ex.Message });
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while creating refund request");
                return StatusCode((int)HttpStatusCode.Conflict, 
                    new { message = "A refund request for this citizen and tax year already exists." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating refund request: {Message}", ex.Message);
                return StatusCode((int)HttpStatusCode.InternalServerError, 
                    new { message = $"An error occurred while creating the refund request: {ex.Message}" });
            }
        }

        // חישוב החזר
        [Authorize(Roles = "Clerk")]
        [HttpPost("{id}/calculate")]
        public async Task<IActionResult> Calculate(int id, [FromBody] CalculateRequestDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id <= 0)
            {
                return BadRequest(new { message = "Invalid request ID." });
            }

            try
            {
                await _refundService.CalculateRefundAsync(id, dto.ClerkId, dto.Approve);
                return Ok(new { message = "Refund calculation completed successfully." });
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while calculating refund");
                return StatusCode((int)HttpStatusCode.InternalServerError, 
                    new { message = "An error occurred while calculating the refund." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating refund");
                return StatusCode((int)HttpStatusCode.InternalServerError,
                    new { message = "An error occurred while calculating the refund." });
            }

        }

        /// <summary>
        /// מסך פקיד – רשימת בקשות ממתינות
        /// </summary>
        [Authorize(Roles = "Clerk")]
        [HttpGet("pending")]
        public async Task<IActionResult> GetPending()
        {
            try
            {
                var pending = await _refundService.GetPendingRequestsAsync();
                return Ok(pending);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting pending refund requests");
                return StatusCode((int)HttpStatusCode.InternalServerError,
                    new { message = "An error occurred while retrieving pending refund requests." });
            }
        }

        /// <summary>
        /// מסך פקיד – פרטי בקשה בודדת
        /// </summary>
        [Authorize(Roles = "Clerk")]
        [HttpGet("{id:int}/details")]
        public async Task<IActionResult> GetDetails(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new { message = "Invalid request ID." });
            }

            try
            {
                var details = await _refundService.GetRequestDetailsAsync(id);
                if (details == null)
                {
                    return NotFound(new { message = $"Refund request with ID {id} not found." });
                }

                return Ok(details);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting refund request details");
                return StatusCode((int)HttpStatusCode.InternalServerError,
                    new { message = "An error occurred while retrieving refund request details." });
            }
        }
    }
}
