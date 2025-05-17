
import React from 'react';

interface UsersErrorProps {
  error: string;
  isLoggedIn: boolean;
}

const UsersError: React.FC<UsersErrorProps> = ({ error, isLoggedIn }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
      <p>{error}</p>
      {!isLoggedIn && (
        <p className="mt-2">You need to be logged in to view all users.</p>
      )}
    </div>
  );
};

export default UsersError;
