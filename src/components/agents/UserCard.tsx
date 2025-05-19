
import React from 'react';
import { User } from '@/hooks/users/useUserFetch';
import { Button } from "@/components/ui/button";
import { Info, Star, StarOff, ChevronDown, ChevronUp, Play, Pause } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface UserCardProps {
  user: User;
  userRole: string;
  canSeeAudio: boolean;
  onViewDetails: () => void;
  onToggleAvailability: () => void;
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
  userRole,
  canSeeAudio,
  onViewDetails,
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
  
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {/* Availability Badge */}
        {user.is_available && (
          <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Available
          </div>
        )}
        
        {/* User Header with Avatar */}
        <div className="p-4 bg-muted/30">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
              {(user.full_name?.[0] || user.email?.[0] || "?").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold truncate">
                {user.full_name || user.email || "Unknown User"}
              </h3>
              {user.country && (
                <p className="text-sm text-muted-foreground">
                  {user.city ? `${user.city}, ` : ''}{user.country}
                </p>
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
        
        <CardContent className="p-4">
          {/* User Details */}
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
            {user.salary_expectation && (
              <p className="text-sm">
                <span className="font-medium">Salary Expectation:</span>{" "}
                ${user.salary_expectation}/month
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
            
            {isAdmin && (
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
      </div>
    </Card>
  );
};

export default UserCard;
