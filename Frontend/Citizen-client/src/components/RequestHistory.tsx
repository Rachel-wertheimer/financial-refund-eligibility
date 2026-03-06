import React from 'react';
import type { PastRefundRequestDto } from '../types';

interface RequestHistoryProps {
  history: PastRefundRequestDto[];
}

const RequestHistory: React.FC<RequestHistoryProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold mb-4 text-[#0f2a44] text-right">היסטוריית בקשות</h3>
        <div className="text-center py-12">
          <div className="text-5xl mb-3">📜</div>
          <p className="text-gray-600 text-lg text-right">אין בקשות קודמות</p>
          <p className="text-gray-500 text-sm text-right mt-2">
            בקשות שתגיש יופיעו כאן לאחר טיפול
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-5 text-[#0f2a44] text-right">היסטוריית בקשות</h3>
      <div className="overflow-x-auto table-container">
        <table className="w-full text-right">
          <thead>
            <tr className="table-header">
              <th className="px-6 py-4 text-right">שנת מס</th>
              <th className="px-6 py-4 text-right">סטטוס</th>
              <th className="px-6 py-4 text-right">סכום שאושר</th>
            </tr>
          </thead>
          <tbody>
            {history.map((request, index) => (
              <tr key={request.id} className={`table-row ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="px-6 py-4 font-medium">{request.taxYear}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
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
                      : request.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-[#0f2a44]">
                  {request.approvedAmount
                    ? `${request.approvedAmount.toLocaleString('he-IL')} ₪`
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestHistory;
