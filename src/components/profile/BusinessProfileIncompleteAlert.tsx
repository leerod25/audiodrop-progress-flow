
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export interface BusinessProfileIncompleteAlertProps {
  isVisible: boolean;
}

const BusinessProfileIncompleteAlert = ({ isVisible }: BusinessProfileIncompleteAlertProps) => {
  return isVisible ? (
    <Alert variant="destructive" className="bg-amber-50 border-amber-200">
      <AlertTriangle className="h-5 w-5 text-amber-500" />
      <AlertTitle className="text-amber-800">Complete Your Business Profile</AlertTitle>
      <AlertDescription className="text-amber-700">
        Please complete your business profile to unlock all features and get matched with voice talent.
      </AlertDescription>
    </Alert>
  ) : null;
};

export default BusinessProfileIncompleteAlert;
