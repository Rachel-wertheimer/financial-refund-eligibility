import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { createRefundRequest, getMonthlyIncomes } from '../api/citizenApi';
import { fetchCitizenByIdentity } from '../store/slices/citizenSlice';
import type { CreateRefundRequestDto } from '../types';

interface CreateRequestButtonProps {
  citizenId: number;
  identityNumber: string;
  currentYear: number;
}

const CreateRequestButton: React.FC<CreateRequestButtonProps> = ({
  citizenId,
  identityNumber,
  currentYear,
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [checkingIncomes, setCheckingIncomes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [taxYear, setTaxYear] = useState(currentYear);

  // בדיקת מספר הכנסות לפני הגשת בקשה
  const checkIncomesBeforeSubmit = async (): Promise<boolean> => {
    setCheckingIncomes(true);
    setError(null);
    try {
      const incomes = await getMonthlyIncomes(citizenId, taxYear);
      if (incomes.length < 6) {
        setError(
          `לא ניתן להתחיל בקשה – לשנת המס ${taxYear} יש פחות מ-6 הכנסות. נדרשות לפחות 6 הכנסות חודשיות.`
        );
        setCheckingIncomes(false);
        return false;
      }
      setCheckingIncomes(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'שגיאה בבדיקת הכנסות');
      setCheckingIncomes(false);
      return false;
    }
  };

  const handleStartRequest = async () => {
    setError(null);
    // בדיקה לפני הצגת אישור
    const hasEnoughIncomes = await checkIncomesBeforeSubmit();
    if (hasEnoughIncomes) {
      setShowConfirm(true);
    }
  };

  const handleCreateRequest = async () => {
    setError(null);
    setLoading(true);

    // בדיקה נוספת לפני הגשת הבקשה (למקרה שההכנסות התעדכנו)
    const hasEnoughIncomes = await checkIncomesBeforeSubmit();
    if (!hasEnoughIncomes) {
      setLoading(false);
      return;
    }

    try {
      const requestData: CreateRefundRequestDto = {
        citizenId,
        taxYear,
      };
      await createRefundRequest(requestData);
      // Refresh citizen data
      await dispatch(fetchCitizenByIdentity(identityNumber));
      setShowConfirm(false);
    } catch (err: any) {
      setError(err.message || 'שגיאה ביצירת בקשה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-5 text-[#0f2a44] text-right">הגשת בקשה חדשה</h3>

      {!showConfirm ? (
        <div className="space-y-4">
          <div>
            <label className="label">שנת מס</label>
            <input
              type="number"
              value={taxYear}
              onChange={(e) => setTaxYear(Number(e.target.value))}
              min="2000"
              max="2100"
              className="input-field"
              dir="rtl"
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

          <button
            onClick={handleStartRequest}
            disabled={checkingIncomes}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkingIncomes ? 'בודק הכנסות...' : 'התחל בקשה חדשה'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-right">
              האם אתה בטוח שברצונך להגיש בקשה להחזר כספי לשנת המס {taxYear}?
            </p>
            <p className="text-blue-700 text-right text-sm mt-2">
              ניתן להגיש בקשה אחת בלבד לכל שנת מס
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-right text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowConfirm(false);
                setError(null);
              }}
              className="btn-secondary flex-1"
            >
              ביטול
            </button>
            <button
              onClick={handleCreateRequest}
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'יוצר...' : 'אישור והגשה'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRequestButton;
