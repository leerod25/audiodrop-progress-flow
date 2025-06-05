
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Clock, CheckCircle } from "lucide-react";

interface InviteAccessBannerProps {
  email: string;
  expiresAt: string;
}

const InviteAccessBanner: React.FC<InviteAccessBannerProps> = ({ email, expiresAt }) => {
  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-blue-50 border-blue-200 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">
              Guest Access Active
            </h3>
            <div className="space-y-1 text-sm text-blue-700">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Invited email: {email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Access expires: {formatExpiryDate(expiresAt)}</span>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              You can listen to agent audio recordings and view profiles without creating an account.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InviteAccessBanner;
