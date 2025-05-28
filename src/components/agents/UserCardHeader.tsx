
import React from 'react';
import { User } from '@/hooks/users/useUserFetch';
import { Button } from "@/components/ui/button";
import { Star, StarOff, ChevronDown, ChevronUp, Play } from "lucide-react";
import StarRating from './StarRating';

interface UserCardHeaderProps {
  user: User & { average_rating?: number | null };
  isPriorityAgent: boolean;
  hasAudio: boolean;
  inTeam?: boolean;
  onToggleTeam?: () => void;
  isExpanded?: boolean;
  toggleExpand?: () => void;
}

const UserCardHeader: React.FC<UserCardHeaderProps> = ({
  user,
  isPriorityAgent,
  hasAudio,
  inTeam = false,
  onToggleTeam,
  isExpanded = false,
  toggleExpand
}) => {
  // Generate a display name that shows either "Mission Statement" for the special agent or the agent ID for others
  const displayName = isPriorityAgent 
    ? "Mission Statement" 
    : `Agent ID: ${user.id.substring(0, 8)}`;

  return (
    <div className={`p-4 ${isPriorityAgent ? 'bg-blue-50' : 'bg-muted/30'}`}>
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-full ${isPriorityAgent ? 'bg-blue-200 text-blue-700' : 'bg-gray-200 text-gray-600'} flex items-center justify-center text-xl font-bold`}>
          {isPriorityAgent ? "MS" : user.id.substring(0, 1).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h3 className={`text-lg font-semibold truncate ${isPriorityAgent ? 'text-blue-700' : ''}`}>
              {displayName}
            </h3>
            {/* Audio indicator */}
            {hasAudio && (
              <Play 
                className="ml-2 text-green-500 hover:text-green-600" 
                size={16}
                aria-label="Has audio samples"
              />
            )}
          </div>
          {user.country && (
            <p className="text-sm text-muted-foreground">
              {user.city ? `${user.city}, ` : ''}{user.country}
            </p>
          )}
          
          {/* Display average rating */}
          {user.average_rating && (
            <div className="mt-1">
              <StarRating
                rating={user.average_rating}
                readonly={true}
                size="sm"
                allowHalfStars={true}
              />
            </div>
          )}
        </div>
        
        {/* Team Button */}
        {onToggleTeam && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTeam}
            className={inTeam ? "text-yellow-500" : "text-gray-400"}
            title={inTeam ? "Remove from team" : "Add to team"}
          >
            {inTeam ? <Star className="h-5 w-5" /> : <StarOff className="h-5 w-5" />}
          </Button>
        )}

        {/* Expand/Collapse button for UsersList */}
        {toggleExpand && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExpand}
            title={isExpanded ? "Collapse details" : "Expand details"}
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserCardHeader;
