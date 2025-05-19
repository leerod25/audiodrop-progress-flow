
import React from 'react';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDate } from '@/utils/dateUtils';
import { getAvatarImage, getAvatarFallback } from '@/utils/avatarUtils';

interface UserHeaderProps {
  id: string;
  email: string;
  fullName?: string;
  gender?: string | null;
  createdAt: string;
  isAvailable?: boolean;
  isAdmin: boolean;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  id,
  email,
  fullName,
  gender,
  createdAt,
  isAvailable,
  isAdmin,
}) => {
  // Format the user ID to show only first 8 characters
  const formatUserId = (id: string) => `${id.substring(0, 8)}...`;
  const avatarImage = getAvatarImage(gender);
  
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 border">
        <AvatarImage src={avatarImage} alt={gender || 'Agent'} />
        <AvatarFallback>{getAvatarFallback(email, gender)}</AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center gap-2">
          {/* Show full name only for admins */}
          <h3 className="text-lg font-medium">
            {isAdmin && fullName ? fullName : formatUserId(id)}
          </h3>
          {isAvailable !== undefined && (
            <Badge 
              variant={isAvailable ? "default" : "destructive"}
              className="ml-2"
            >
              {isAvailable ? 'Available' : 'On Project'}
            </Badge>
          )}
        </div>
        <div className="text-sm text-gray-500 mt-1 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>Joined {formatDate(createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
