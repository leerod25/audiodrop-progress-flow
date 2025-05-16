
import React from 'react';

interface ProfileIncompleteAlertProps {
  isVisible: boolean;
}

const ProfileIncompleteAlert = ({ isVisible }: ProfileIncompleteAlertProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
      <p className="text-amber-800 font-medium">Please complete your profile with your name, contact details, location, and computer skills to continue as an agent.</p>
    </div>
  );
};

export default ProfileIncompleteAlert;
