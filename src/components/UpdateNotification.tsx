import React, { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';

const UpdateNotification: React.FC = () => {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    const handleUpdateFound = () => {
      setShowUpdate(true);
    };

    window.addEventListener('vite-plugin-pwa:update-found', handleUpdateFound);

    return () => {
      window.removeEventListener('vite-plugin-pwa:update-found', handleUpdateFound);
    };
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
      <div className="flex items-start gap-3">
        <RefreshCw className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">Mise à jour disponible</h3>
          <p className="text-xs text-blue-100 mb-3">
            Une nouvelle version de l'application est disponible.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-white text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-blue-50 transition-colors"
            >
              Mettre à jour
            </button>
            <button
              onClick={handleDismiss}
              className="text-blue-100 hover:text-white text-xs transition-colors"
            >
              Plus tard
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-blue-200 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default UpdateNotification; 