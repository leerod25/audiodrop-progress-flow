
import React from 'react';
import { MapPin, Briefcase, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { User } from '@/hooks/users/useUserFetch';

interface UserProfileProps {
  user: User;
  toggleAvailability?: (userId: string, currentStatus: boolean) => Promise<void>;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, toggleAvailability }) => {
  const handleAvailabilityToggle = async () => {
    if (toggleAvailability) {
      await toggleAvailability(user.id, !!user.is_available);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {/* Location information */}
      {(user.country || user.city) && (
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
          <span className="text-sm">{[user.city, user.country].filter(Boolean).join(", ")}</span>
        </div>
      )}
      
      {/* Experience information */}
      {user.years_experience && (
        <div className="flex items-center">
          <Briefcase className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
          <span className="text-sm">{user.years_experience} years experience</span>
        </div>
      )}

      {/* Languages Section */}
      {user.languages && user.languages.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
            <div className="text-sm font-medium">Languages:</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 ml-6">
            {user.languages.map((lang, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">{lang}</Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Availability toggle */}
      {toggleAvailability && (
        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <span className="text-sm font-medium">Availability Status:</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{user.is_available ? 'Available' : 'On Project'}</span>
            <Switch
              checked={!!user.is_available}
              onCheckedChange={handleAvailabilityToggle}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
