
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import AuthHeading from "@/components/auth/AuthHeading";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserContext } from "@/contexts/UserContext";
import BusinessSignupForm from "@/components/auth/BusinessSignupForm";
import AuthError from "@/components/auth/AuthError";

const BusinessSignup = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/"); // Redirect to home if already logged in
      }
    });
  }, [navigate]);

  return (
    <div className="container max-w-lg mx-auto py-10 px-4">
      <Card className="w-full">
        <AuthHeading title="Create Business Account" />
        
        <AuthError message={errorMessage} />
        
        <BusinessSignupForm setErrorMessage={setErrorMessage} />
        
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
