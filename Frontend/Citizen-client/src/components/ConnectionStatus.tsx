import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44384/api';
        await axios.get(`${API_BASE_URL}/citizens/by-identity/test`, {
          timeout: 3000,
          validateStatus: (status) => status < 500, // Accept 404 as "connected"
        });
        setIsConnected(true);
      } catch (error: any) {
        if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
          setIsConnected(false);
        } else {
          // If we get 404, server is connected
          setIsConnected(true);
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return null;
  }

  if (!isConnected) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-red-500 text-xl">⚠️</span>
          </div>
          <div className="mr-3 flex-1">
            <p className="text-sm text-red-800 text-right font-semibold">
              לא ניתן להתחבר לשרת
            </p>
            <p className="text-xs text-red-600 text-right mt-1">
              אנא ודא שהשרת רץ על https://localhost:44384
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ConnectionStatus;
