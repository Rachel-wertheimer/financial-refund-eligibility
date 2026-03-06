import React from 'react';
import type { IncomeYearGroupDto } from '../types';

interface IncomeByYearDisplayProps {
  incomesByYear: IncomeYearGroupDto[];
}

const IncomeByYearDisplay: React.FC<IncomeByYearDisplayProps> = ({ incomesByYear }) => {
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

  const calculateYearAverage = (incomes: IncomeYearGroupDto['monthlyIncomes']): number => {
    if (!incomes || incomes.length === 0) return 0;
    const total = incomes.reduce((sum, income) => sum + (income?.amount || 0), 0);
    return total / incomes.length;
  };

  if (!incomesByYear || incomesByYear.length === 0) {
    return (
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 text-right">הכנסות לפי שנים</h3>
        <p className="text-gray-600 text-right">אין נתוני הכנסות זמינים</p>
      </div>
    );
  }

  return (
    <div className="border-b pb-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-700 text-right">הכנסות לפי שנים</h3>
      <div className="space-y-4">
        {incomesByYear.map((yearGroup) => {
          if (!yearGroup) return null;
          const average = calculateYearAverage(yearGroup.monthlyIncomes || []);
          return (
            <div key={yearGroup.taxYear || Math.random()} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-800">שנת מס: {yearGroup.taxYear || 'לא זמין'}</h4>
                <span className="text-sm text-gray-600">
                  ממוצע: {average.toLocaleString('he-IL', { maximumFractionDigits: 2 })} ₪
                </span>
              </div>
              {yearGroup.monthlyIncomes && yearGroup.monthlyIncomes.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {yearGroup.monthlyIncomes.map((income) => {
                    if (!income) return null;
                    const monthIndex = (income.month || 1) - 1;
                    return (
                      <div
                        key={income.month || Math.random()}
                        className="bg-white rounded p-2 text-center border border-gray-200"
                      >
                        <div className="text-xs text-gray-600">
                          {monthNames[monthIndex] || `חודש ${income.month || ''}`}
                        </div>
                        <div className="text-sm font-semibold text-gray-800">
                          {Number(income.amount || 0).toLocaleString('he-IL')} ₪
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-right">אין נתוני הכנסות חודשיים</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IncomeByYearDisplay;
