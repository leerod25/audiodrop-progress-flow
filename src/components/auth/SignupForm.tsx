import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Key, Briefcase, UserCircle } from "lucide-react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

interface SignupFormProps {
  setErrorMessage: (message: string | null) => void;
}

const SignupForm = ({ setErrorMessage }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<"agent" | "business">("agent");
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      if (userRole === "business") {
        // Navigate to business signup with email and password
        navigate('/business-signup', { state: { email, password } });
        return;
      }

      // Only proceed with regular signup if agent role is selected
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            role: userRole
          }
        }
      });
      
      if (error) throw error;
      
      // Create role in dedicated table
      if (data.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ user_id: data.user.id, role: userRole });
        
        if (roleError) {
          console.error("Error setting user role:", roleError);
        }
      }
      
      uiToast({
        title: "Account created!",
        description: "Please check your email for a confirmation link.",
      });
      
      // If no error and we have a user, immediately redirect to profile
      if (data.user) {
        toast("Complete your profile", {
          description: "Please fill out your profile information to continue.",
        });
        navigate('/profile');
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setErrorMessage(error.message || "Something went wrong during signup");
      uiToast({
        variant: "destructive",
        title: "Error creating account",
        description: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email-signup">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email-signup"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password-signup">Password</Label>
          <div className="relative">
            <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password-signup"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Password must be at least 6 characters long
          </p>
        </div>

        <div className="space-y-3">
          <Label>Account Type</Label>
          <RadioGroup 
            value={userRole} 
            onValueChange={(value) => setUserRole(value as "agent" | "business")}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="agent" id="agent" />
              <Label htmlFor="agent" className="flex items-center cursor-pointer">
                <UserCircle className="mr-2 h-5 w-5" />
                Agent
                <span className="ml-2 text-xs text-gray-500">(Work as an agent)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="business" id="business" />
              <Label htmlFor="business" className="flex items-center cursor-pointer">
                <Briefcase className="mr-2 h-5 w-5" />
                Business Owner
                <span className="ml-2 text-xs text-gray-500">(Hire agents)</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
          <p className="text-amber-800 text-sm">
            After sign up, you'll need to complete your profile before using the system.
          </p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : userRole === "agent" ? "Create Agent Account" : "Continue to Business Signup"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignupForm;
