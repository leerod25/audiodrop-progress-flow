import React from 'react';
// Add any imports you need

export interface ProfileIncompleteAlertProps {
  isVisible: boolean;
}

// Update this component to match its usage in Profile.tsx
const ProfileIncompleteAlert = ({ isVisible }: ProfileIncompleteAlertProps) => {
  return isVisible ? (
    <div className="rounded-md bg-yellow-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.214-1.36 2.979 0l8.93 15.79a1.5 1.5 0 01-1.44 2.102H2.309a1.5 1.5 0 01-1.44-2.102l8.93-15.79zM13 5a1 1 0 11-2 0 1 1 0 012 0zm-1 7a1 1 0 10-2 0v3a1 1 0 102 0v-3z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Profile Incomplete
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Please complete your profile to unlock all features.
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default ProfileIncompleteAlert;
