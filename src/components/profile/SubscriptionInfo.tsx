
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleCheck } from 'lucide-react';

interface SubscriptionInfoProps {
  userRole?: string | null;
}

const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({ userRole }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>
          Service information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-md">
          <div className="flex items-center space-x-4">
            <CircleCheck className="text-green-500 h-6 w-6" />
            <div>
              <h3 className="text-lg font-medium">Free Service</h3>
              <p className="text-sm text-muted-foreground">
                This service is free for agents
              </p>
            </div>
          </div>
        </div>
        
        {userRole === 'business' && (
          <div className="space-y-2">
            <h3 className="text-md font-medium">Business Features:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access to browse all agent profiles</li>
              <li>Unlimited audio samples</li>
              <li>Team management features</li>
              <li>Priority support</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionInfo;
