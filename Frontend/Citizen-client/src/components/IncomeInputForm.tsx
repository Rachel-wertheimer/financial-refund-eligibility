import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { createMonthlyIncome } from '../api/citizenApi';
import type { CreateMonthlyIncomeDto } from '../types';

interface IncomeInputFormProps {
  citizenId: number;
  onSuccess?: () => void;
}

const IncomeInputForm: React.FC<IncomeInputFormProps> = ({ citizenId, onSuccess }) => {
  const dispatch = useAppDispatch();
  const [taxYear, setTaxYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const monthNames = [
    'ינואר',
    'פברואר',
    'מרץ',
    'אפריל',
    'מאי',
    'יוני',
    'יולי',
    'אוגוסט',
    'ספטמבר',
    'אוקטובר',
    'נובמבר',
    'דצמבר',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!amount || Number(amount) <= 0) {
      setError('יש להזין סכום תקין');
      return;
    }

    setLoading(true);
    try {
      const incomeData: CreateMonthlyIncomeDto = {
        citizenId,
        taxYear,
        month,
        amount: Number(amount),
      };
      await createMonthlyIncome(incomeData);
      setSuccess(true);
      setAmount('');
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'שגיאה בהוספת הכנסה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-5 text-[#0f2a44] text-right">הזנת הכנסה חודשית</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {monthNames.map((name, index) => (
                <option key={index + 1} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">סכום הכנסה (₪)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              placeholder="הזן סכום"
              className="input-field"
              dir="rtl"
              required
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-right text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-right text-sm">הכנסה נוספה בהצלחה!</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'שומר...' : 'שמור הכנסה'}
        </button>
      </form>
    </div>
  );
};

export default IncomeInputForm;
