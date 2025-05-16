
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import TeamInviteDialog from '../auth/TeamInviteDialog';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';

interface BusinessProfileHeaderProps {
  profileCompleted: boolean;
}

const BusinessProfileHeader = ({ profileCompleted }: BusinessProfileHeaderProps) => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = React.useState(false);
  
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-2xl font-bold">Business Profile</CardTitle>
      {profileCompleted && (
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => setIsInviteDialogOpen(true)}
        >
          <UserPlus size={16} />
          <span>Invite Team</span>
        </Button>
      )}
      <TeamInviteDialog isOpen={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen} />
    </CardHeader>
  );
};

export default BusinessProfileHeader;
