
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import AuthHeading from "@/components/auth/AuthHeading";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserContext } from "@/contexts/UserContext";
import BusinessSignupForm from "@/components/auth/BusinessSignupForm";
import AuthError from "@/components/auth/AuthError";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Loader } from "lucide-react";

const BusinessSignup = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionCheckProgress, setSessionCheckProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserContext();
  
  // Get email and password from location state if available
  const emailFromState = location.state?.email || "";
  const passwordFromState = location.state?.password || "";

  useEffect(() => {
    // Set up progress indicator
    const progressInterval = setInterval(() => {
      setSessionCheckProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/"); // Redirect to home if already logged in
      }

      // If no email was provided in state, redirect back to auth page
      if (!emailFromState) {
        navigate('/auth', { state: { tabIndex: 'signup' } });
        setErrorMessage("Email is required to create a business account");
      }
      
      setIsLoading(false);
      clearInterval(progressInterval);
      setSessionCheckProgress(100);
    }).catch(error => {
      setErrorMessage("Failed to check authentication status. Please try again.");
      setIsLoading(false);
      clearInterval(progressInterval);
    });

    return () => {
      clearInterval(progressInterval);
    };
  }, [navigate, emailFromState]);

  if (isLoading) {
    return (
      <div className="container max-w-lg mx-auto py-10 px-4">
        <Card className="w-full p-6 space-y-4">
          <div className="flex items-center justify-center">
            <Loader className="h-6 w-6 animate-spin mr-2" />
            <span>Checking authentication status...</span>
          </div>
          <Progress value={sessionCheckProgress} className="h-2" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-lg mx-auto py-10 px-4">
      <Card className="w-full">
        <AuthHeading title="Create Business Account" />
        
        <AuthError message={errorMessage} />
        
        <BusinessSignupForm 
          setErrorMessage={setErrorMessage} 
          initialEmail={emailFromState}
          initialPassword={passwordFromState}
        />
        
        <div className="p-6 text-center">
          <button 
            onClick={() => navigate('/auth')} 
            className="text-sm text-blue-600 hover:underline"
          >
            Back to regular signup
          </button>
        </div>
      </Card>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div>
  );
};

export default BusinessSignup;
