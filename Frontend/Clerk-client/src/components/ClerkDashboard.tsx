import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchPendingRequests, fetchMonthlyBudget } from '../store/slices/clerkSlice';
import { logout } from '../api/clerkApi';
import PendingRequestsList from './PendingRequestsList';
import RequestDetailsView from './RequestDetailsView';
import BudgetDisplay from './BudgetDisplay';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import CreateRequestForm from './CreateRequestForm';
import CitizenLookup from './CitizenLookup';
import CitizenHistoryView from './CitizenHistoryView';
import type { CitizenSummaryDto } from '../types';

const ClerkDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pendingRequests, selectedRequestId, loading, error, currentBudget } = useAppSelector(
    (state) => state.clerk
  );
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [showCitizenLookup, setShowCitizenLookup] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState<CitizenSummaryDto | null>(null);

  useEffect(() => {
    dispatch(fetchPendingRequests());
    // Fetch current month budget
    const now = new Date();
    dispatch(fetchMonthlyBudget({ year: now.getFullYear(), month: now.getMonth() + 1 }));
  }, [dispatch]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleCreateRequestSuccess = () => {
    setShowCreateRequest(false);
    dispatch(fetchPendingRequests());
  };

  const handleCitizenFound = (summary: CitizenSummaryDto) => {
    setSelectedCitizen(summary);
    setShowCitizenLookup(false);
  };

  // Show create request form
  if (showCreateRequest) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => setShowCreateRequest(false)} className="btn-secondary mb-4">
            חזור ללוח הבקרה
          </button>
          <CreateRequestForm onSuccess={handleCreateRequestSuccess} onCancel={() => setShowCreateRequest(false)} />
        </div>
      </div>
    );
  }

  // Show citizen history
  if (selectedCitizen) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <CitizenHistoryView summary={selectedCitizen} onClose={() => setSelectedCitizen(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
              התנתק
            </button>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-[#0f2a44] mb-2">
                לוח בקרה - פקיד
              </h1>
              <p className="text-gray-600 text-lg">ניהול בקשות החזר כספי</p>
            </div>
          </div>
          <div className="flex gap-4 justify-center mt-4">
            <button onClick={() => setShowCreateRequest(true)} className="btn-primary">
              הגשת בקשה חדשה
            </button>
            <button
              onClick={() => setShowCitizenLookup(!showCitizenLookup)}
              className="btn-secondary"
            >
              {showCitizenLookup ? 'סגור חיפוש' : 'חיפוש אזרח לפי תעודת זהות'}
            </button>
          </div>
        </div>

        {showCitizenLookup && (
          <div className="mb-6">
            <CitizenLookup onCitizenFound={handleCitizenFound} />
          </div>
        )}

        {error && <ErrorMessage message={error} />}

        {loading && <LoadingSpinner />}

        {currentBudget && <BudgetDisplay budget={currentBudget} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1">
            <PendingRequestsList requests={pendingRequests || []} />
          </div>
          <div className="lg:col-span-1">
            {selectedRequestId ? (
              <RequestDetailsView requestId={selectedRequestId} />
            ) : (
              <div className="card text-center">
                <div className="py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-gray-600 text-lg mb-2">אין בקשה נבחרת</p>
                  <p className="text-gray-500 text-sm">
                    בחר בקשה מהרשימה כדי לראות פרטים ולבצע חישוב
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClerkDashboard;
