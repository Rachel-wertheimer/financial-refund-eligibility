import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { fetchCitizenByIdentity } from '../store/slices/citizenSlice';
import ErrorMessage from './ErrorMessage';

const IdentityInput: React.FC = () => {
  const [identityNumber, setIdentityNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!identityNumber.trim()) {
      setError('מספר זהות הוא שדה חובה');
      return;
    }

    try {
      await dispatch(fetchCitizenByIdentity(identityNumber.trim())).unwrap();
      // אם הצליח - מעבר ללוח הבקרה
      navigate('/dashboard');
    } catch (err: any) {
      // אם האזרח לא נמצא - הצעה להרשמה
      if (err.message?.includes('לא נמצא') || err.message?.includes('404')) {
        setError('אזרח לא נמצא במערכת. האם תרצה להירשם?');
      } else {
        setError(err.message || 'שגיאה בחיפוש');
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto card">
      <h2 className="text-2xl font-bold mb-6 text-[#0f2a44] text-center">
        התחברות למערכת
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="identity" className="label">
            מספר זהות
          </label>
          <input
            id="identity"
            type="text"
            value={identityNumber}
            onChange={(e) => {
              setIdentityNumber(e.target.value);
              setError(null);
            }}
            placeholder="הזן מספר זהות"
            className="input-field"
            dir="rtl"
            required
          />
        </div>

        {error && (
          <div>
            <ErrorMessage message={error} />
            {error.includes('לא נמצא') && (
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="btn-primary w-full"
                >
                  הירשם עכשיו
                </button>
              </div>
            )}
          </div>
        )}

        <button type="submit" className="btn-primary w-full">
          התחבר
        </button>
      </form>
    </div>
  );
};

export default IdentityInput;
