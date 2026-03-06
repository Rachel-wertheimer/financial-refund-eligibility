import React from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { clearError } from '../store/slices/citizenSlice';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <p className="text-red-800 text-right">{message}</p>
        <button
          onClick={() => dispatch(clearError())}
          className="text-red-600 hover:text-red-800 font-semibold"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
