import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { clearCitizenData } from '../store/slices/citizenSlice';
import IdentityInput from './IdentityInput';
import LastRequestCard from './LastRequestCard';
import RequestHistory from './RequestHistory';
import IncomeInputForm from './IncomeInputForm';
import CreateRequestButton from './CreateRequestButton';
import IncomesView from './IncomesView';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const CitizenDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { citizenSummary, loading, error, identityNumber } = useAppSelector(
    (state) => state.citizen
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'income' | 'request'>('overview');
  const [incomesRefreshTrigger, setIncomesRefreshTrigger] = useState(0);

  const handleLogout = () => {
    dispatch(clearCitizenData());
  };

  const handleIncomeAdded = () => {
    // Trigger refresh of incomes view
    setIncomesRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            {citizenSummary && (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                התנתק
              </button>
            )}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-[#0f2a44] mb-3">
                מערכת החזר כספי
              </h1>
              <p className="text-gray-600 text-lg">בדיקת זכאות והצגת היסטוריית בקשות</p>
            </div>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        {loading && <LoadingSpinner />}

        {!citizenSummary && !loading && !error && <IdentityInput />}

        {citizenSummary && !loading && citizenSummary.citizen && (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="card bg-[#0f2a44] text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-right">
                שלום {citizenSummary.citizen.fullName || 'אזרח'}
              </h2>
              <p className="text-gray-200 text-right text-lg">
                ת.ז: {citizenSummary.citizen.identityNumber || 'לא זמין'}
              </p>
            </div>

            {/* Tabs */}
            <div className="card p-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === 'overview'
                      ? 'bg-[#0f2a44] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  סקירה כללית
                </button>
                <button
                  onClick={() => setActiveTab('income')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === 'income'
                      ? 'bg-[#0f2a44] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  הכנסות
                </button>
                <button
                  onClick={() => setActiveTab('request')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === 'request'
                      ? 'bg-[#0f2a44] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  בקשות
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {citizenSummary.lastRequest && (
                  <LastRequestCard request={citizenSummary.lastRequest} />
                )}
                <RequestHistory history={citizenSummary.history || []} />
              </div>
            )}

            {activeTab === 'income' && (
              <div className="space-y-6">
                <IncomeInputForm
                  citizenId={citizenSummary.citizen.citizenId}
                  onSuccess={handleIncomeAdded}
                />
                <IncomesView 
                  citizenId={citizenSummary.citizen.citizenId} 
                  refreshTrigger={incomesRefreshTrigger}
                />
              </div>
            )}

            {activeTab === 'request' && (
              <div className="space-y-6">
                <CreateRequestButton
                  citizenId={citizenSummary.citizen.citizenId}
                  identityNumber={citizenSummary.citizen.identityNumber}
                  currentYear={new Date().getFullYear()}
                />
                <RequestHistory history={citizenSummary.history || []} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;
