import React from 'react';
import type { CitizenSummaryDto } from '../types';

interface CitizenHistoryViewProps {
  summary: CitizenSummaryDto;
  onClose: () => void;
}

const CitizenHistoryView: React.FC<CitizenHistoryViewProps> = ({ summary, onClose }) => {
  const formatStatus = (status: string | number) => {
    const statusMap: Record<string, string> = {
      '0': 'ממתין',
      '1': 'חושב',
      '2': 'אושר',
      '3': 'נדחה',
      Pending: 'ממתין',
      Calculated: 'חושב',
      Approved: 'אושר',
      Rejected: 'נדחה',
    };
    return statusMap[status.toString()] || status.toString();
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return 'לא זמין';
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
    }).format(amount);
  };

  return (
    <div className="card shadow-xl max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onClose} className="btn-secondary">
          סגור
        </button>
        <h2 className="text-2xl font-bold text-[#0f2a44] text-right">היסטוריית אזרח</h2>
      </div>

      {/* Citizen Info */}
      <div className="card bg-[#0f2a44] text-white mb-6">
        <h3 className="text-xl font-bold mb-2 text-right">{summary.citizen.fullName}</h3>
        <p className="text-gray-200 text-right">ת.ז: {summary.citizen.identityNumber}</p>
      </div>

      {/* Last Request */}
      {summary.lastRequest && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-right">בקשה אחרונה</h3>
          <div className="grid grid-cols-2 gap-4 text-right">
            <div>
              <p className="text-sm text-gray-600">שנת מס</p>
              <p className="text-lg font-semibold">{summary.lastRequest.taxYear}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">סטטוס</p>
              <p className="text-lg font-semibold">{formatStatus(summary.lastRequest.status)}</p>
            </div>
            {summary.lastRequest.calculatedAmount && (
              <div>
                <p className="text-sm text-gray-600">סכום מחושב</p>
                <p className="text-lg font-semibold">{formatAmount(summary.lastRequest.calculatedAmount)}</p>
              </div>
            )}
            {summary.lastRequest.approvedAmount && (
              <div>
                <p className="text-sm text-gray-600">סכום מאושר</p>
                <p className="text-lg font-semibold text-green-600">{formatAmount(summary.lastRequest.approvedAmount)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-right">היסטוריית בקשות</h3>
        {summary.history && summary.history.length > 0 ? (
          <div className="space-y-4">
            {summary.history.map((request) => (
              <div
                key={request.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
              >
                <div className="grid grid-cols-3 gap-4 text-right">
                  <div>
                    <p className="text-sm text-gray-600">שנת מס</p>
                    <p className="text-lg font-semibold">{request.taxYear}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">סטטוס</p>
                    <p className="text-lg font-semibold">{formatStatus(request.status)}</p>
                  </div>
                  {request.approvedAmount && (
                    <div>
                      <p className="text-sm text-gray-600">סכום מאושר</p>
                      <p className="text-lg font-semibold text-green-600">{formatAmount(request.approvedAmount)}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600 text-lg">אין היסטוריית בקשות</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenHistoryView;
