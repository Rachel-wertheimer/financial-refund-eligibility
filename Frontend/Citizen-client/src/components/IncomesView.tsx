import React, { useEffect, useState } from 'react';
import { getMonthlyIncomes } from '../api/citizenApi';
import type { MonthlyIncomeDto } from '../types';

interface IncomesViewProps {
  citizenId: number;
  taxYear?: number;
  refreshTrigger?: number; // Trigger to refresh incomes
}

const IncomesView: React.FC<IncomesViewProps> = ({ citizenId, taxYear, refreshTrigger }) => {
  const [incomes, setIncomes] = useState<MonthlyIncomeDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(taxYear || new Date().getFullYear());

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

  useEffect(() => {
    if (citizenId && selectedYear) {
      loadIncomes();
    }
  }, [citizenId, selectedYear, refreshTrigger]); // Added refreshTrigger dependency

  const loadIncomes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMonthlyIncomes(citizenId, selectedYear);
      setIncomes(data || []);
    } catch (err: any) {
      setError(err.message || 'שגיאה בטעינת הכנסות');
      setIncomes([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return incomes.reduce((sum, income) => sum + (income.amount || 0), 0);
  };

  const calculateAverage = () => {
    if (incomes.length === 0) return 0;
    return calculateTotal() / incomes.length;
  };

  const getIncomeForMonth = (month: number) => {
    return incomes.find((inc) => inc.month === month);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 text-right">הכנסות חודשיות</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 text-right">שנת מס</label>
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            min="2000"
            max="2100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
            dir="rtl"
          />
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-800 text-right text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {incomes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-right">אין הכנסות רשומות לשנה זו</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                {monthNames.map((name, index) => {
                  const monthIncome = getIncomeForMonth(index + 1);
                  return (
                    <div
                      key={index + 1}
                      className={`bg-gray-50 rounded-lg p-3 text-center border-2 ${
                        monthIncome
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-200 border-dashed'
                      }`}
                    >
                      <div className="text-xs text-gray-600 mb-1">{name}</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {monthIncome
                          ? `${Number(monthIncome.amount).toLocaleString('he-IL')} ₪`
                          : '-'}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="grid grid-cols-2 gap-4 text-right">
                  <div>
                    <p className="text-sm text-gray-600">סה"כ הכנסות</p>
                    <p className="text-lg font-bold text-gray-800">
                      {calculateTotal().toLocaleString('he-IL')} ₪
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ממוצע חודשי</p>
                    <p className="text-lg font-bold text-blue-600">
                      {calculateAverage().toLocaleString('he-IL', { maximumFractionDigits: 2 })} ₪
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default IncomesView;
