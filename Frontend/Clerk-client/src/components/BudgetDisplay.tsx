import React from 'react';
import type { MonthlyBudgetDto } from '../types';

interface BudgetDisplayProps {
  budget: MonthlyBudgetDto;
}

const BudgetDisplay: React.FC<BudgetDisplayProps> = ({ budget }) => {
  if (!budget) {
    return null;
  }

  const totalBudget = Number(budget.totalBudget || 0);
  const usedBudget = Number(budget.usedBudget || 0);
  const availableBudget = Number(budget.availableBudget || 0);
  const percentage = totalBudget > 0 ? (availableBudget / totalBudget) * 100 : 0;

  return (
    <div className="card bg-[#0f2a44] text-white shadow-xl">
      <h2 className="text-2xl font-bold mb-5 text-right">תקציב חודשי</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
        <div>
          <p className="text-sm opacity-90">תקציב כולל</p>
          <p className="text-2xl font-bold">{totalBudget.toLocaleString('he-IL')} ₪</p>
        </div>
        <div>
          <p className="text-sm opacity-90">תקציב משומש</p>
          <p className="text-2xl font-bold">{usedBudget.toLocaleString('he-IL')} ₪</p>
        </div>
        <div>
          <p className="text-sm opacity-90">תקציב זמין</p>
          <p className="text-3xl font-bold text-green-300">
            {availableBudget.toLocaleString('he-IL')} ₪
          </p>
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
          <div
            className="bg-green-300 h-3 rounded-full transition-all duration-300"
            style={{
              width: `${Math.max(0, Math.min(100, percentage))}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BudgetDisplay;
