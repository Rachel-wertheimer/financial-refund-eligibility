import React from 'react';
import type { PastRefundRequestDto } from '../types';

interface PastRequestsDisplayProps {
  pastRequests: PastRefundRequestDto[];
}

const PastRequestsDisplay: React.FC<PastRequestsDisplayProps> = ({ pastRequests }) => {
  if (!pastRequests || pastRequests.length === 0) {
    return (
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 text-right">בקשות עבר</h3>
        <p className="text-gray-600 text-right">אין בקשות קודמות</p>
      </div>
    );
  }

  return (
    <div className="border-b pb-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-700 text-right">בקשות עבר</h3>
      <div className="space-y-2">
        {pastRequests.map((request) => {
          if (!request) return null;
          return (
            <div
              key={request.id || Math.random()}
              className="bg-gray-50 rounded-lg p-3 flex justify-between items-center"
            >
              <div className="text-right">
                <p className="font-medium text-gray-800">שנת מס: {request.taxYear || 'לא זמין'}</p>
                <p className="text-sm text-gray-600">
                  סטטוס:{' '}
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      request.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : request.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {request.status === 'Approved'
                      ? 'אושר'
                      : request.status === 'Rejected'
                      ? 'נדחה'
                      : request.status || 'לא ידוע'}
                  </span>
                </p>
              </div>
              {request.approvedAmount !== undefined && request.approvedAmount !== null && (
                <div className="text-left">
                  <p className="font-semibold text-green-600">
                    {Number(request.approvedAmount).toLocaleString('he-IL')} ₪
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PastRequestsDisplay;
