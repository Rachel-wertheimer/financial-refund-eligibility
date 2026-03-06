using Core.DTO.Auth;
using Microsoft.AspNetCore.Mvc;
using Service.Service;
using System;
using System.Net;
using System.Threading.Tasks;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ClerkService _clerkService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(ClerkService clerkService, ILogger<AuthController> logger)
        {
            _clerkService = clerkService;
            _logger = logger;
        }

        /// <summary>
        /// התחברות פקיד – החזרת JWT
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                {
                    return BadRequest(new { message = "Username and password are required." });
                }

                var clerk = await _clerkService.ValidateClerkAsync(dto.Username, dto.Password);
                if (clerk == null)
                {
                    _logger.LogWarning("Failed login attempt for username: {Username}", dto.Username);
                    return Unauthorized(new { message = "Invalid username or password." });
                }

                var tokenResponse = _clerkService.GenerateJwtToken(clerk);
                return Ok(tokenResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during clerk login: {Message}", ex.Message);
                return StatusCode((int)HttpStatusCode.InternalServerError,
                    new { message = $"An error occurred during login: {ex.Message}" });
            }
        }
    }
}

