
import React from 'react';
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface UserCardActionsProps {
  isAdmin: boolean;
  userIsAvailable: boolean;
  inTeam?: boolean;
  onViewDetails: () => void;
  onToggleAvailability?: () => void;
  onToggleTeam?: () => void;
}

const UserCardActions: React.FC<UserCardActionsProps> = ({
  isAdmin,
  userIsAvailable,
  inTeam = false,
  onViewDetails,
  onToggleAvailability,
  onToggleTeam
}) => {
  return (
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
          {userIsAvailable ? 'Set Unavailable' : 'Set Available'}
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
  );
};

export default UserCardActions;
