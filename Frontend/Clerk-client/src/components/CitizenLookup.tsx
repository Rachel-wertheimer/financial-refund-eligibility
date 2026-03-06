import React, { useState } from 'react';
import { getCitizenSummaryByIdentity } from '../api/clerkApi';
import type { CitizenSummaryDto } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface CitizenLookupProps {
  onCitizenFound: (summary: CitizenSummaryDto) => void;
}

const CitizenLookup: React.FC<CitizenLookupProps> = ({ onCitizenFound }) => {
  const [identityNumber, setIdentityNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const summary = await getCitizenSummaryByIdentity(identityNumber.trim());
      onCitizenFound(summary);
      setIdentityNumber('');
    } catch (err: any) {
      setError(err.message || 'שגיאה בחיפוש אזרח');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-5 text-[#0f2a44] text-right">חיפוש אזרח לפי תעודת זהות</h3>
      <form onSubmit={handleSearch} className="space-y-5">
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
        {error && <ErrorMessage message={error} />}
        <button
          type="submit"
          disabled={loading || !identityNumber.trim()}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <LoadingSpinner /> : 'חפש'}
        </button>
      </form>
    </div>
  );
};

export default CitizenLookup;
