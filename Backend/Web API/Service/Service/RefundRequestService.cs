using AutoMapper;
using Core.DTO.RefundRequests;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Service
{
    public class RefundRequestService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly RefundDbContext _context;
        private readonly IMapper _mapper;

        public RefundRequestService(IUnitOfWork unitOfWork, RefundDbContext context, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _context = context;
            _mapper = mapper;
        }

        // יצירת בקשה חדשה
        public async Task<RefundRequestDto> CreateRefundRequestAsync(int citizenId, int taxYear)
        {
            // בדיקה שהאזרח קיים
            var citizen = await _unitOfWork.Citizens.GetByIdAsync(citizenId);
            if (citizen == null)
            {
                throw new ArgumentException($"Citizen with ID {citizenId} not found.");
            }

            // בדיקה אם כבר קיימת בקשה מאושרת לאותה שנה
            var existingRequests = await _unitOfWork.RefundRequests.GetAllAsync();
            bool hasApprovedRequest = existingRequests.Any(r =>
                r.CitizenId == citizenId &&
                r.TaxYear == taxYear &&
                r.Status == RequestStatus.Approved);

            if (hasApprovedRequest)
            {
                throw new InvalidOperationException(
                    $"An approved refund request for citizen {citizenId} and tax year {taxYear} already exists.");
            }

            // בדיקה אם קיימת בקשה פתוחה (Pending / Calculated) לאותה שנה
            bool hasOpenRequest = existingRequests.Any(r =>
                r.CitizenId == citizenId &&
                r.TaxYear == taxYear &&
                (r.Status == RequestStatus.Pending || r.Status == RequestStatus.Calculated));

            if (hasOpenRequest)
            {
                throw new InvalidOperationException(
                    $"An open refund request for citizen {citizenId} and tax year {taxYear} already exists.");
            }

            var request = new RefundRequest
            {
                CitizenId = citizenId,
                TaxYear = taxYear,
                Status = RequestStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.RefundRequests.AddAsync(request);
            await _unitOfWork.SaveAsync();

            return _mapper.Map<RefundRequestDto>(request);
        }

        public async Task CalculateRefundAsync(int requestId, int clerkId, bool approve)
        {
            // בדיקה שהבקשה קיימת
            var request = await _unitOfWork.RefundRequests.GetByIdAsync(requestId);
            if (request == null)
            {
                throw new ArgumentException($"Refund request with ID {requestId} not found.");
            }

            await _context.Database.ExecuteSqlRawAsync(
                "EXEC CalculateRefund @RequestId = {0}, @ClerkId = {1}, @Approve = {2}",
                requestId, clerkId, approve ? 1 : 0
            );

        }

        /// <summary>
        /// בקשות ממתינות לטיפול (למסך הפקיד)
        /// </summary>
        public async Task<List<RefundRequestListItemDto>> GetPendingRequestsAsync()
        {
            var requests = await _unitOfWork.RefundRequests.GetAllAsync();
            var citizens = await _unitOfWork.Citizens.GetAllAsync();

            var pending = requests
                .Where(r => r.Status == RequestStatus.Pending || r.Status == RequestStatus.Calculated)
                .OrderBy(r => r.CreatedAt)
                .Select(r =>
                {
                    var citizen = citizens.First(c => c.CitizenId == r.CitizenId);
                    return new RefundRequestListItemDto
                    {
                        Id = r.Id,
                        TaxYear = r.TaxYear,
                        Status = r.Status.ToString(),
                        CreatedAt = r.CreatedAt,
                        CitizenId = citizen.CitizenId,
                        CitizenFullName = citizen.FullName,
                        CitizenIdentityNumber = citizen.IdentityNumber
                    };
                })
                .ToList();

            return pending;
        }

        /// <summary>
        /// פרטי בקשה בודדת למסך הפקיד
        /// </summary>
        public async Task<RefundRequestDetailsDto?> GetRequestDetailsAsync(int requestId)
        {
            var requests = await _unitOfWork.RefundRequests.GetAllAsync();
            var request = requests.FirstOrDefault(r => r.Id == requestId);
            if (request == null)
            {
                return null;
            }

            var citizen = await _unitOfWork.Citizens.GetByIdAsync(request.CitizenId);
            if (citizen == null)
            {
                throw new InvalidOperationException($"Citizen for request {requestId} not found.");
            }

            var allIncomes = await _unitOfWork.MonthlyIncomes.GetAllAsync();
            var incomesForCitizen = allIncomes
                .Where(i => i.CitizenId == citizen.CitizenId)
                .GroupBy(i => i.TaxYear)
                .Select(g => new IncomeYearGroupDto
                {
                    TaxYear = g.Key,
                    MonthlyIncomes = g
                        .OrderBy(i => i.Month)
                        .Select(i => new IncomeMonthAmountDto
                        {
                            Month = i.Month,
                            Amount = i.Amount
                        })
                        .ToList()
                })
                .ToList();

            var citizenRequests = requests
                .Where(r => r.CitizenId == citizen.CitizenId && r.Id != requestId)
                .OrderByDescending(r => r.TaxYear)
                .Select(r => new PastRefundRequestDto
                {
                    Id = r.Id,
                    TaxYear = r.TaxYear,
                    Status = r.Status.ToString(),
                    ApprovedAmount = r.ApprovedAmount
                })
                .ToList();

            var details = new RefundRequestDetailsDto
            {
                Request = _mapper.Map<RefundRequestDto>(request),
                Citizen = new CitizenInRequestDto
                {
                    CitizenId = citizen.CitizenId,
                    IdentityNumber = citizen.IdentityNumber,
                    FullName = citizen.FullName
                },
                IncomesByYear = incomesForCitizen,
                PastRequests = citizenRequests
            };

            return details;
        }

    }
}
