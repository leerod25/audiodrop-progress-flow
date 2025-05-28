
import React from 'react';
import { User } from '@/hooks/users/useUserFetch';

interface UserCardDetailsProps {
  user: User;
}

const UserCardDetails: React.FC<UserCardDetailsProps> = ({ user }) => {
  return (
    <div className="space-y-2 mb-4">
      {user.gender && (
        <p className="text-sm">
          <span className="font-medium">Gender:</span> {user.gender}
        </p>
      )}
      {user.years_experience && (
        <p className="text-sm">
          <span className="font-medium">Experience:</span> {user.years_experience} years
        </p>
      )}
      {user.languages && user.languages.length > 0 && (
        <p className="text-sm">
          <span className="font-medium">Languages:</span>{" "}
          {user.languages.join(", ")}
        </p>
      )}
    </div>
  );
};

export default UserCardDetails;
