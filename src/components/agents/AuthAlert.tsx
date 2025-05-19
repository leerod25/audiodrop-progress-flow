
import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthAlert: React.FC = () => {
  return (
    <Alert className="mb-6 bg-amber-50 border-amber-200">
      <InfoIcon className="h-5 w-5 text-amber-600" />
      <AlertTitle className="text-amber-800">Limited Preview Mode</AlertTitle>
      <AlertDescription className="text-amber-700">
        You're viewing agent profiles in preview mode. To access audio samples and contact information, please register or log in.
        <div className="mt-3 flex flex-wrap gap-3">
          <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700">
            <Link to="/auth">Log In</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-100">
            <Link to="/auth?tab=signup">Sign Up</Link>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default AuthAlert;
