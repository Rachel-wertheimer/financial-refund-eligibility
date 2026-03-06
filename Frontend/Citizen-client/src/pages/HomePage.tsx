import React from 'react';
import { Link } from 'react-router-dom';
import IdentityInput from '../components/IdentityInput';
import { useAppSelector } from '../hooks/useAppSelector';

const HomePage: React.FC = () => {
  const { citizenSummary, loading, error } = useAppSelector((state) => state.citizen);

  return (
    <div className="min-h-screen bg-[#f5f7fa] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <Link
              to="/register"
              className="btn-secondary"
            >
              הרשמה
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f2a44] mb-3">
            מערכת החזר כספי
          </h1>
          <p className="text-gray-600 text-lg">בדיקת זכאות והצגת היסטוריית בקשות</p>
        </div>

        {!citizenSummary && !loading && !error && (
          <div className="flex justify-center">
            <IdentityInput />
          </div>
        )}

        {citizenSummary && (
          <div className="text-center">
            <p className="text-gray-600 mb-4">ברוך הבא, {citizenSummary.citizen.fullName}</p>
            <Link to="/dashboard" className="btn-primary inline-block">
              עבור ללוח הבקרה
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
