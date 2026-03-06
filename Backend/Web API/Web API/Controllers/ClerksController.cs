using Core.DTO.Auth;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using BCrypt.Net;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClerksController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ClerksController> _logger;

        public ClerksController(IUnitOfWork unitOfWork, ILogger<ClerksController> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        /// <summary>
        /// יצירת פקיד חדש (לבדיקות בלבד - יש להסיר בייצור)
        /// </summary>
        [HttpPost("create")]
        public async Task<IActionResult> CreateClerk([FromBody] CreateClerkDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var clerks = await _unitOfWork.Clerks.GetAllAsync();
                var existingClerk = clerks.FirstOrDefault(c => c.Username == dto.Username);
                if (existingClerk != null)
                {
                    return Conflict(new { message = "Clerk with this username already exists." });
                }

                var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
                var clerk = new Clerk
                {
                    Username = dto.Username,
                    PasswordHash = passwordHash,
                    CreatedAt = DateTime.UtcNow
                };

                await _unitOfWork.Clerks.AddAsync(clerk);
                await _unitOfWork.SaveAsync();

                return Ok(new { message = "Clerk created successfully.", clerkId = clerk.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating clerk");
                return StatusCode((int)HttpStatusCode.InternalServerError,
                    new { message = "An error occurred while creating the clerk." });
            }
        }
    }

    public class CreateClerkDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
