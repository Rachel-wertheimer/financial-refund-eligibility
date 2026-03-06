using AutoMapper;
using Core.DTO.Citizens;
using Core.DTO.RefundRequests;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Service.Service
{
    public class CitizenService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CitizenService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<CitizenDto> CreateCitizenAsync(string identityNumber, string fullName)
        {
            if (string.IsNullOrWhiteSpace(identityNumber))
                throw new ArgumentException("IdentityNumber is required", nameof(identityNumber));

            if (string.IsNullOrWhiteSpace(fullName))
                throw new ArgumentException("FullName is required", nameof(fullName));

            // בדיקה שאין אזרח עם אותו תעודת זהות
            var existingCitizens = await _unitOfWork.Citizens.GetAllAsync();
            if (existingCitizens.Any(c => c.IdentityNumber == identityNumber))
            {
                throw new InvalidOperationException($"Citizen with identity number {identityNumber} already exists.");
            }

            var citizen = new Citizen
            {
                IdentityNumber = identityNumber,
                FullName = fullName,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Citizens.AddAsync(citizen);
            await _unitOfWork.SaveAsync();

            return _mapper.Map<CitizenDto>(citizen);
        }

        /// <summary>
        /// שליפה לפי ת\"ז כולל הבקשה האחרונה והיסטוריית הבקשות
        /// </summary>
        public async Task<CitizenSummaryDto> GetCitizenSummaryByIdentityAsync(string identityNumber)
        {
            var citizens = await _unitOfWork.Citizens.GetAllAsync();
            var citizen = citizens.FirstOrDefault(c => c.IdentityNumber == identityNumber);

            if (citizen == null)
            {
                throw new ArgumentException($"Citizen with identity number {identityNumber} not found.");
            }

            var requests = await _unitOfWork.RefundRequests.GetAllAsync();
            var citizenRequests = requests
                .Where(r => r.CitizenId == citizen.CitizenId)
                .OrderByDescending(r => r.TaxYear)
                .ToList();

            var lastRequest = citizenRequests.FirstOrDefault();

            var history = citizenRequests
                .Select(r => new PastRefundRequestDto
                {
                    Id = r.Id,
                    TaxYear = r.TaxYear,
                    Status = r.Status.ToString(),
                    ApprovedAmount = r.ApprovedAmount
                })
                .ToList();

            var summary = new CitizenSummaryDto
            {
                Citizen = _mapper.Map<CitizenDto>(citizen),
                LastRequest = lastRequest != null
                    ? _mapper.Map<RefundRequestDto>(lastRequest)
                    : null,
                History = history
            };

            return summary;
        }
    }
}
