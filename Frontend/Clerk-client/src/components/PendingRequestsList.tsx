import React from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setSelectedRequestId } from '../store/slices/clerkSlice';
import type { RefundRequestListItemDto } from '../types';

interface PendingRequestsListProps {
  requests: RefundRequestListItemDto[];
}

const PendingRequestsList: React.FC<PendingRequestsListProps> = ({ requests }) => {
  const dispatch = useAppDispatch();

  const handleRequestClick = (requestId: number) => {
    dispatch(setSelectedRequestId(requestId));
  };

  if (!requests || requests.length === 0) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold mb-5 text-[#0f2a44] text-right">בקשות ממתינות</h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-gray-600 text-lg mb-2">אין בקשות ממתינות כרגע</p>
          <p className="text-gray-500 text-sm">כל הבקשות טופלו או טרם הוגשו בקשות חדשות</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-5 text-[#0f2a44] text-right">בקשות ממתינות</h2>
      <div className="space-y-3">
        {requests.map((request) => {
          if (!request || !request.id) return null;
          return (
            <div
              key={request.id}
              onClick={() => handleRequestClick(request.id)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-[#f0f4f8] hover:border-[#0f2a44] cursor-pointer transition-all duration-200 hover:shadow-md"
            >
              <div className="flex justify-between items-start">
                <div className="text-right flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {request.citizenFullName || 'לא זמין'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    ת.ז: {request.citizenIdentityNumber || 'לא זמין'}
                  </p>
                  <p className="text-sm text-gray-600">שנת מס: {request.taxYear || 'לא זמין'}</p>
                  {request.createdAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      תאריך יצירה:{' '}
                      {new Date(request.createdAt).toLocaleDateString('he-IL', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </p>
                  )}
                </div>
                <div className="ml-4">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    ממתין
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PendingRequestsList;
