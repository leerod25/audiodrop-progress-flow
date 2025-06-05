
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const BusinessInviteForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
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
        body: { email },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error sending invitation:', error);
        toast.error("Failed to send invitation");
        return;
      }

      toast.success(`Invitation sent to ${email}`);
      setEmail("");
      
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast.error("Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Send Business Invitation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendInvite} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Business Email Address</Label>
            <Input 
              id="invite-email" 
              type="email" 
              placeholder="business@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit"
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
        </form>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Invitations expire in 7 days and provide temporary access to agent profiles and audio recordings without requiring account creation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessInviteForm;
