import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { createCitizen } from '../api/citizenApi';
import { fetchCitizenByIdentity } from '../store/slices/citizenSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [identityNumber, setIdentityNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // יצירת אזרח חדש
      await createCitizen(identityNumber.trim(), fullName.trim());
      
      // אחרי הרשמה מוצלחת - שליפת הנתונים והכנסה למערכת
      await dispatch(fetchCitizenByIdentity(identityNumber.trim()));
      
      // מעבר ללוח הבקרה
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'שגיאה בהרשמה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f2a44] mb-3">
            הרשמה למערכת
          </h1>
          <p className="text-gray-600 text-lg">הזן את פרטיך כדי להירשם למערכת</p>
        </div>

        <div className="max-w-md mx-auto card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="identity" className="label">
                מספר זהות
              </label>
              <input
                id="identity"
                type="text"
                value={identityNumber}
                onChange={(e) => setIdentityNumber(e.target.value)}
                placeholder="הזן מספר זהות"
                className="input-field"
                dir="rtl"
                required
              />
            </div>

            <div>
              <label htmlFor="fullName" className="label">
                שם מלא
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="הזן שם מלא"
                className="input-field"
                dir="rtl"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-red-500 text-xl">⚠️</span>
                  </div>
                  <div className="mr-3 flex-1">
                    <p className="text-red-800 text-right font-semibold text-base">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-secondary flex-1"
              >
                ביטול
              </button>
              <button
                type="submit"
                disabled={loading || !identityNumber.trim() || !fullName.trim()}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <LoadingSpinner /> : 'הירשם והתחבר'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
