import React from 'react';
import type { RefundRequestDto } from '../types';
import { RequestStatus } from '../types';

interface LastRequestCardProps {
  request: RefundRequestDto;
}

const LastRequestCard: React.FC<LastRequestCardProps> = ({ request }) => {
  const getStatusText = (status: RequestStatus): string => {
    switch (status) {
      case RequestStatus.Pending:
        return 'ממתין לחישוב';
      case RequestStatus.Calculated:
        return 'חושב';
      case RequestStatus.Approved:
        return 'אושר';
      case RequestStatus.Rejected:
        return 'נדחה';
      default:
        return 'לא ידוע';
    }
  };

  const getStatusColor = (status: RequestStatus): string => {
    switch (status) {
      case RequestStatus.Pending:
        return 'bg-yellow-100 text-yellow-800';
      case RequestStatus.Calculated:
        return 'bg-blue-100 text-blue-800';
      case RequestStatus.Approved:
        return 'bg-green-100 text-green-800';
      case RequestStatus.Rejected:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!request) {
    return null;
  }

  return (
    <div className="card border-l-4 border-[#0f2a44]">
      <h3 className="text-xl font-bold mb-5 text-[#0f2a44] text-right">הבקשה האחרונה</h3>
      <div className="space-y-3 text-right">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">שנת מס:</span>
          <span className="font-semibold">{request.taxYear || 'לא זמין'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">סטטוס:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              request.status ?? RequestStatus.Pending
            )}`}
          >
            {getStatusText(request.status ?? RequestStatus.Pending)}
          </span>
        </div>
        {request.calculatedAmount !== undefined && request.calculatedAmount !== null && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">סכום זכאות מחושב:</span>
            <span className="font-semibold text-lg">
              {Number(request.calculatedAmount).toLocaleString('he-IL')} ₪
            </span>
          </div>
        )}
        {request.approvedAmount !== undefined && request.approvedAmount !== null && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">סכום שאושר:</span>
            <span className="font-semibold text-lg text-green-600">
              {Number(request.approvedAmount).toLocaleString('he-IL')} ₪
            </span>
          </div>
        )}
        {request.status === RequestStatus.Pending && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 text-right">
              הבקשה שלך ממתינה לחישוב על ידי פקיד
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LastRequestCard;
