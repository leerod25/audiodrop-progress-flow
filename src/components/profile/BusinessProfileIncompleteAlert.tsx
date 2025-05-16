
import React from 'react';

interface BusinessProfileIncompleteAlertProps {
  isVisible: boolean;
}

const BusinessProfileIncompleteAlert = ({ isVisible }: BusinessProfileIncompleteAlertProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
      <p className="text-amber-800 font-medium">
        Please complete your business profile with your business name, email, phone, and location to access all features.
      </p>
    </div>
  );
};

export default BusinessProfileIncompleteAlert;
