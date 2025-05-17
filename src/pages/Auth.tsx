
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserContext } from "@/contexts/UserContext";
import AuthHeading from "@/components/auth/AuthHeading";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import AuthError from "@/components/auth/AuthError";

const Auth = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        navigate("/dashboard"); // Redirect to dashboard if already logged in
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          
          if (event === "SIGNED_IN") {
            // Check if this is a new user who needs to complete their profile
            const { data } = await supabase
              .from('profiles')
              .select('full_name, phone, city, country')
              .eq('id', session.user.id)
              .single();
            
            // If profile data is incomplete, redirect to profile page
            if (!data || !data.full_name || !data.phone || !data.city || !data.country) {
              navigate("/profile");
            } else {
              navigate("/dashboard");
            }
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, setUser]);

  const clearError = () => {
    setErrorMessage(null);
  };

  return (
    <div className="container max-w-lg mx-auto py-10 px-4">
      <Card className="w-full">
        <AuthHeading />
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="flex items-center gap-2" onClick={clearError}>
              <LogIn className="h-4 w-4" />
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex items-center gap-2" onClick={clearError}>
              <UserPlus className="h-4 w-4" />
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          <AuthError message={errorMessage} />
          
          <TabsContent value="login">
            <LoginForm setErrorMessage={setErrorMessage} />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupForm setErrorMessage={setErrorMessage} />
          </TabsContent>
        </Tabs>
      </Card>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Having trouble logging in? Make sure your email has been confirmed.</p>
      </div>
    </div>
  );
};

export default Auth;
