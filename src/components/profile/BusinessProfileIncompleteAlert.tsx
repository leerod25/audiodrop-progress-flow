
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface BusinessProfileIncompleteAlertProps {
  isVisible: boolean;
}

const BusinessProfileIncompleteAlert = ({ isVisible }: BusinessProfileIncompleteAlertProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md flex gap-3 items-start">
      <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-medium text-amber-800 mb-1">Your business profile is incomplete</h4>
        <p className="text-amber-700 text-sm">
          Please complete your business profile with your business name, email, phone, and location to access all features.
        </p>
      </div>
    </div>
  );
};

export default BusinessProfileIncompleteAlert;
