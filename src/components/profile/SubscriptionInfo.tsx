
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleCheck, AlertCircle, CreditCard } from 'lucide-react';

interface SubscriptionInfoProps {
  subscription?: {
    plan: string;
    status: string;
    next_billing_date?: string;
  };
  userRole?: string | null;
}

const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({ subscription, userRole }) => {
  const isPaid = subscription?.plan !== 'Free';
  const isActive = subscription?.status === 'active';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>
          Manage your subscription and billing information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-md">
          <div className="flex items-center space-x-4">
            {isActive ? (
              <CircleCheck className="text-green-500 h-6 w-6" />
            ) : (
              <AlertCircle className="text-amber-500 h-6 w-6" />
            )}
            <div>
              <h3 className="text-lg font-medium">{subscription?.plan || 'Free'} Plan</h3>
              <p className="text-sm text-muted-foreground">
                {isActive ? 'Your subscription is active' : 'Your subscription is inactive'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">
              {subscription?.plan === 'Free' ? 'Free' : '$19.99/mo'}
            </p>
            {subscription?.next_billing_date && (
              <p className="text-sm text-muted-foreground">
                Next billing: {new Date(subscription.next_billing_date).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        
        {userRole === 'business' && (
          <div className="space-y-2">
            <h3 className="text-md font-medium">Plan Benefits:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access to browse all agent profiles</li>
              <li>Unlimited audio samples</li>
              <li>Team management features</li>
              <li>Priority support</li>
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isPaid ? (
          <div className="w-full flex space-x-2">
            <Button variant="outline" className="flex-1">Change Plan</Button>
            <Button variant="destructive" className="flex-1">Cancel Subscription</Button>
          </div>
        ) : (
          <Button className="w-full" disabled={userRole !== 'business'}>
            <CreditCard className="mr-2 h-4 w-4" />
            Upgrade to Pro
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionInfo;
