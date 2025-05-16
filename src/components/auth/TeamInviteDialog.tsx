
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

interface TeamInviteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const TeamInviteDialog: React.FC<TeamInviteDialogProps> = ({ 
  isOpen, 
  onOpenChange 
}) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const { toast: uiToast } = useToast();

  const handleSendInvite = async () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      uiToast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address",
      });
      return;
    }
    
    try {
      // In a real implementation, you would send an invitation email via a backend service
      // Here we just show a success toast for demo purposes
      toast("Invitation sent", {
        description: `An invitation email has been sent to ${inviteEmail}`,
      });
      setInviteEmail("");
      onOpenChange(false);
    } catch (error) {
      uiToast({
        variant: "destructive",
        title: "Failed to send invitation",
        description: "Please try again later",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email Address</Label>
            <Input 
              id="invite-email" 
              type="email" 
              placeholder="colleague@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleSendInvite} 
            className="w-full flex items-center justify-center gap-2"
          >
            <UserPlus size={16} />
            <span>Send Invitation</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamInviteDialog;
