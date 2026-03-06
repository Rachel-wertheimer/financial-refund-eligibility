import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  fetchRequestDetails,
  calculateRefundRequest,
  fetchMonthlyBudget,
  clearSelectedRequest,
} from '../store/slices/clerkSlice';
import { getClerkIdFromToken } from '../utils/jwt';
import type { CalculateRequestDto } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import IncomeByYearDisplay from './IncomeByYearDisplay';
import PastRequestsDisplay from './PastRequestsDisplay';

interface RequestDetailsViewProps {
  requestId: number;
}

const RequestDetailsView: React.FC<RequestDetailsViewProps> = ({ requestId }) => {
  const dispatch = useAppDispatch();
  const { selectedRequestDetails, currentBudget, loading, error } = useAppSelector(
    (state) => state.clerk
  );
  const [clerkId] = useState(() => {
    // Get clerk ID from JWT token
    return getClerkIdFromToken() || 1; // Fallback to 1 if not found
  });
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    dispatch(fetchRequestDetails(requestId));
    // Fetch current month budget
    const now = new Date();
    dispatch(fetchMonthlyBudget({ year: now.getFullYear(), month: now.getMonth() + 1 }));
  }, [dispatch, requestId]);

  const handleCalculate = async (approve: boolean) => {
    setIsCalculating(true);
    const calculateRequest: CalculateRequestDto = {
      clerkId,
      approve,
    };
    try {
      await dispatch(calculateRefundRequest({ requestId, calculateRequest })).unwrap();
      // Refetch details to get updated status
      await dispatch(fetchRequestDetails(requestId));
      // Refetch budget
      const now = new Date();
      await dispatch(fetchMonthlyBudget({ year: now.getFullYear(), month: now.getMonth() + 1 }));
    } catch (err) {
      console.error('Failed to calculate refund:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  if (loading && !selectedRequestDetails) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!selectedRequestDetails) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
        לא נמצאו פרטי בקשה
      </div>
    );
  }

  const { request, citizen, incomesByYear, pastRequests } = selectedRequestDetails;
  const canCalculate = request?.status === 0; // Pending

  if (!request || !citizen) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
        לא נמצאו פרטי בקשה תקינים
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-gray-800 text-right">פרטי בקשה</h2>
        <button
          onClick={() => dispatch(clearSelectedRequest())}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Citizen Info */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 text-right">פרטי אזרח</h3>
        <div className="space-y-1 text-right">
          <p>
            <span className="font-medium">שם:</span> {citizen?.fullName || 'לא זמין'}
          </p>
          <p>
            <span className="font-medium">ת.ז:</span> {citizen?.identityNumber || 'לא זמין'}
          </p>
        </div>
      </div>

      {/* Current Request Info */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 text-right">פרטי הבקשה הנוכחית</h3>
        <div className="space-y-1 text-right">
          <p>
            <span className="font-medium">שנת מס:</span> {request?.taxYear || 'לא זמין'}
          </p>
          <p>
            <span className="font-medium">סטטוס:</span>{' '}
            <span
              className={`px-2 py-1 rounded text-sm ${
                request.status === 0
                  ? 'bg-yellow-100 text-yellow-800'
                  : request.status === 1
                  ? 'bg-blue-100 text-blue-800'
                  : request.status === 2
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {request.status === 0
                ? 'ממתין לחישוב'
                : request.status === 1
                ? 'חושב'
                : request.status === 2
                ? 'אושר'
                : 'נדחה'}
            </span>
          </p>
          {request.calculatedAmount !== undefined && request.calculatedAmount !== null && (
            <p>
              <span className="font-medium">סכום זכאות מחושב:</span>{' '}
              {Number(request.calculatedAmount).toLocaleString('he-IL')} ₪
            </p>
          )}
          {request.approvedAmount !== undefined && request.approvedAmount !== null && (
            <p>
              <span className="font-medium">סכום שאושר:</span>{' '}
              <span className="text-green-600 font-semibold">
                {Number(request.approvedAmount).toLocaleString('he-IL')} ₪
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Incomes by Year */}
      <IncomeByYearDisplay incomesByYear={incomesByYear || []} />

      {/* Past Requests */}
      <PastRequestsDisplay pastRequests={pastRequests || []} />

      {/* Budget Info */}
      {currentBudget && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 text-right">תקציב זמין</h3>
          <div className="space-y-1 text-right">
            <p>
              <span className="font-medium">תקציב כולל:</span>{' '}
              {currentBudget.totalBudget.toLocaleString('he-IL')} ₪
            </p>
            <p>
              <span className="font-medium">תקציב משומש:</span>{' '}
              {currentBudget.usedBudget.toLocaleString('he-IL')} ₪
            </p>
            <p className="text-lg font-bold text-green-600">
              <span className="font-medium">תקציב זמין:</span>{' '}
              {currentBudget.availableBudget.toLocaleString('he-IL')} ₪
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {canCalculate && (
        <div className="flex gap-4 justify-end pt-4 border-t">
          <button
            onClick={() => handleCalculate(false)}
            disabled={isCalculating}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 shadow-md"
          >
            {isCalculating ? 'מעבד...' : 'דחה בקשה'}
          </button>
          <button
            onClick={() => handleCalculate(true)}
            disabled={isCalculating}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 shadow-md"
          >
            {isCalculating ? 'מעבד...' : '✅ אשר וחשב זכאות'}
          </button>
        </div>
      )}

      {!canCalculate && request && (
        <div className="pt-4 border-t">
          <p className="text-gray-600 text-right">
            הבקשה כבר טופלה - סטטוס:{' '}
            {request.status === 2
              ? 'אושר'
              : request.status === 3
              ? 'נדחה'
              : request.status === 1
              ? 'חושב'
              : 'לא ידוע'}
          </p>
        </div>
      )}
    </div>
  );
};

export default RequestDetailsView;
