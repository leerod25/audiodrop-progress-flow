
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSendInvite = async () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You must be logged in to send invitations");
        return;
      }

      const { data, error } = await supabase.functions.invoke('send-business-invitation', {
        body: { email: inviteEmail },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error sending invitation:', error);
        toast.error("Failed to send invitation");
        return;
      }

      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
      onOpenChange(false);
      
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast.error("Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Business to Preview</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Business Email Address</Label>
            <Input 
              id="invite-email" 
              type="email" 
              placeholder="business@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> This will send a temporary access link that expires in 7 days. 
              Recipients can preview agent profiles and audio recordings without creating an account.
            </p>
          </div>
          
          <Button 
            onClick={handleSendInvite} 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <UserPlus size={16} />
            )}
            <span>{isLoading ? "Sending..." : "Send Invitation"}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamInviteDialog;
