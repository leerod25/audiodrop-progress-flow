
import React from 'react';
import { User } from '@/hooks/users/useUserFetch';
import { Button } from "@/components/ui/button";
import { Info, Star, StarOff, ChevronDown, ChevronUp, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import UserExpandedDetails from './UserExpandedDetails';
import StarRating from './StarRating';

interface UserCardProps {
  user: User & { average_rating?: number | null };
  userRole?: string;
  canSeeAudio?: boolean;
  onViewDetails?: () => void;
  onToggleAvailability?: () => void;
  inTeam?: boolean;
  onToggleTeam?: () => void;
  isExpanded?: boolean;
  playingAudio?: string;
  toggleExpand?: () => void;
  onAudioPlay?: (audioId: string) => void;
  showLoginPrompt?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  userRole = 'agent',
  canSeeAudio = false,
  onViewDetails = () => {},
  onToggleAvailability,
  inTeam = false,
  onToggleTeam,
  isExpanded = false,
  playingAudio = "",
  toggleExpand = () => {},
  onAudioPlay = () => {},
  showLoginPrompt = false
}) => {
  const isAdmin = userRole === 'admin';
  const isPriorityAgent = user.id.includes('3a067ecc');
  
  // Generate a display name that shows either "Mission Statement" for the special agent or the agent ID for others
  const displayName = isPriorityAgent 
    ? "Mission Statement" 
    : `Agent ID: ${user.id.substring(0, 8)}`;
  
  // Check if user has audio files
  const hasAudio = user.audio_files && user.audio_files.length > 0;
  
  return (
    <Card className={`overflow-hidden ${isPriorityAgent ? 'border-2 border-blue-500' : ''}`}>
      <div className="relative">
        {/* Availability Badge */}
        {user.is_available && (
          <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Available
          </div>
        )}
        
        {/* User Header with Avatar */}
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
        
        {/* User Details - Only showing professional details, no contact info */}
        <CardContent className="p-4">
          {/* User Details - Only showing professional details, no contact info */}
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
          
          {/* Actions */}
          <div className="flex space-x-2 mt-4 justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={onViewDetails}
            >
              <Info className="h-4 w-4 mr-1" /> Details
            </Button>
            
            {isAdmin && onToggleAvailability && (
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={onToggleAvailability}
              >
                {user.is_available ? 'Set Unavailable' : 'Set Available'}
              </Button>
            )}
            
            {onToggleTeam && (
              <Button 
                variant={inTeam ? "destructive" : "outline"} 
                size="sm"
                className="flex-1"
                onClick={onToggleTeam}
              >
                {inTeam ? 'Remove' : 'Add to Team'}
              </Button>
            )}
          </div>
        </CardContent>
        
        {/* Expanded section with audio files */}
        {isExpanded && (
          <UserExpandedDetails
            isAdmin={isAdmin}
            userId={user.id}
            email={user.email}
            languages={user.languages}
            audioFiles={user.audio_files || []}
            playingAudio={playingAudio || null}
            onAudioPlay={onAudioPlay}
            showLoginPrompt={showLoginPrompt}
          />
        )}
      </div>
    </Card>
  );
};

export default UserCard;
