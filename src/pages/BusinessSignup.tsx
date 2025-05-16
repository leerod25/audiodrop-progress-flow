
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import AuthHeading from "@/components/auth/AuthHeading";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserContext } from "@/contexts/UserContext";
import BusinessSignupForm from "@/components/auth/BusinessSignupForm";
import AuthError from "@/components/auth/AuthError";

const BusinessSignup = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserContext();
  
  // Get email and password from location state if available
  const emailFromState = location.state?.email || "";
  const passwordFromState = location.state?.password || "";

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/"); // Redirect to home if already logged in
      }
    });

    // If no email was provided in state, redirect back to auth page
    if (!emailFromState) {
      navigate('/auth', { state: { tabIndex: 'signup' } });
    }
  }, [navigate, emailFromState]);

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
