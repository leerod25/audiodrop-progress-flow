import React from 'react';
// Add any imports you need

export interface BusinessProfileIncompleteAlertProps {
  isVisible: boolean;
}

// Update this component to match its usage in Profile.tsx
const BusinessProfileIncompleteAlert = ({ isVisible }: BusinessProfileIncompleteAlertProps) => {
  return isVisible ? (
    <div>Business Profile Incomplete Alert</div>
  ) : null;
};

export default BusinessProfileIncompleteAlert;
