import React, { useState } from 'react';
import { createCitizen, createMonthlyIncome, createRefundRequest } from '../api/clerkApi';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface CreateRequestFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateRequestForm: React.FC<CreateRequestFormProps> = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState<'citizen' | 'income' | 'request'>('citizen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Citizen form
  const [identityNumber, setIdentityNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [citizenId, setCitizenId] = useState<number | null>(null);

  // Income form
  const [taxYear, setTaxYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(1);
  const [amount, setAmount] = useState('');
  const [incomesAdded, setIncomesAdded] = useState<number[]>([]);

  // Request form
  const [requestTaxYear, setRequestTaxYear] = useState(new Date().getFullYear());

  const handleCreateCitizen = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const citizen = await createCitizen(identityNumber.trim(), fullName.trim());
      setCitizenId(citizen.citizenId);
      setStep('income');
    } catch (err: any) {
      setError(err.message || 'שגיאה ביצירת אזרח');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenId) return;
    setError(null);
    setLoading(true);

    try {
      await createMonthlyIncome({
        citizenId,
        taxYear,
        month,
        amount: parseFloat(amount),
      });
      setIncomesAdded([...incomesAdded, month]);
      setAmount('');
      setMonth((prev) => (prev >= 12 ? 1 : prev + 1));
    } catch (err: any) {
      setError(err.message || 'שגיאה בהוספת הכנסה');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenId) return;
    setError(null);
    setLoading(true);

    try {
      await createRefundRequest({
        citizenId,
        taxYear: requestTaxYear,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'שגיאה ביצירת בקשה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-xl max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#0f2a44] text-right">יצירת בקשה חדשה</h2>

      {error && <ErrorMessage message={error} />}

      {/* Step 1: Create Citizen */}
      {step === 'citizen' && (
        <form onSubmit={handleCreateCitizen} className="space-y-4">
          <div>
            <label htmlFor="identity" className="label">
              מספר זהות
            </label>
            <input
              type="text"
              id="identity"
              value={identityNumber}
              onChange={(e) => setIdentityNumber(e.target.value)}
              className="input-field"
              placeholder="הזן מספר זהות"
              dir="rtl"
              required
            />
          </div>
          <div>
            <label htmlFor="fullName" className="label">
              שם מלא
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field"
              placeholder="הזן שם מלא"
              dir="rtl"
              required
            />
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={onCancel} className="btn-secondary flex-1">
              ביטול
            </button>
            <button
              type="submit"
              disabled={loading || !identityNumber.trim() || !fullName.trim()}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner /> : 'המשך'}
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Add Incomes */}
      {step === 'income' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-right text-sm">
              הוסף הכנסות חודשיות לשנת המס {taxYear}
            </p>
          </div>
          <form onSubmit={handleAddIncome} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
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
              <div>
                <label className="label">חודש</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="input-field"
                  dir="rtl"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">סכום (ש"ח)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                  dir="rtl"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner /> : 'הוסף הכנסה'}
            </button>
          </form>
          {incomesAdded.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-right text-sm">
                נוספו הכנסות לחודשים: {incomesAdded.sort((a, b) => a - b).join(', ')}
              </p>
            </div>
          )}
          <div className="flex gap-4">
            <button onClick={() => setStep('citizen')} className="btn-secondary flex-1">
              חזור
            </button>
            <button onClick={() => setStep('request')} className="btn-primary flex-1">
              המשך לבקשה
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Create Request */}
      {step === 'request' && (
        <form onSubmit={handleCreateRequest} className="space-y-4">
          <div>
            <label htmlFor="requestTaxYear" className="label">
              שנת מס לבקשה
            </label>
            <input
              type="number"
              id="requestTaxYear"
              value={requestTaxYear}
              onChange={(e) => setRequestTaxYear(Number(e.target.value))}
              min="2000"
              max="2100"
              className="input-field"
              dir="rtl"
              required
            />
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={() => setStep('income')} className="btn-secondary flex-1">
              חזור
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner /> : 'צור בקשה'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateRequestForm;
