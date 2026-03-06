using BCrypt.Net;
using Core.DTO.Auth;
using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Service.Service
{
    public class ClerkService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public ClerkService(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        public async Task<Clerk?> ValidateClerkAsync(string username, string password)
        {
            var clerks = await _unitOfWork.Clerks.GetAllAsync();
            var clerk = clerks.FirstOrDefault(c => c.Username == username);

            if (clerk == null)
            {
                return null;
            }

            var isValid = BCrypt.Net.BCrypt.Verify(password, clerk.PasswordHash);
            return isValid ? clerk : null;
        }

        public LoginResponseDto GenerateJwtToken(Clerk clerk)
        {
            var jwtSection = _configuration.GetSection("Jwt");
            var key = jwtSection.GetValue<string>("Key") 
                      ?? throw new InvalidOperationException("Jwt:Key is missing in configuration.");
            var issuer = jwtSection.GetValue<string>("Issuer") ?? "RefundSystem";
            var audience = jwtSection.GetValue<string>("Audience") ?? "RefundSystemClients";
            var expiresMinutes = jwtSection.GetValue<int?>("ExpiresMinutes") ?? 60;

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, clerk.Username),
                new Claim(ClaimTypes.Role, "Clerk"),
                new Claim("ClerkId", clerk.Id.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
                signingCredentials: credentials);

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return new LoginResponseDto
            {
                Token = tokenString,
                Expiration = token.ValidTo
            };
        }
    }
}

