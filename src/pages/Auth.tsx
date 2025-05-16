
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { LogIn, UserPlus, Mail, Key, Briefcase, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<"agent" | "business">("agent");
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        navigate("/"); // Redirect to home if already logged in
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (event === "SIGNED_IN" && session) {
          // Check if this is a new user who needs to complete their profile
          if (session.user) {
            const { data } = await supabase
              .from('profiles')
              .select('full_name, phone, city, country')
              .eq('id', session.user.id)
              .single();
            
            // If profile data is incomplete, redirect to profile page
            if (!data || !data.full_name || !data.phone || !data.city || !data.country) {
              toast("Complete your profile", {
                description: "Please fill out your profile information to continue.",
              });
              navigate("/profile");
            } else {
              navigate("/");
            }
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
      uiToast({
        variant: "destructive",
        title: "Error creating account",
        description: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      uiToast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      
      // Check if the user has completed their profile
      if (data.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, phone, city, country')
          .eq('id', data.user.id)
          .single();
        
        // If profile is incomplete, redirect to profile page
        if (!profileData || !profileData.full_name || !profileData.phone || !profileData.city || !profileData.country) {
          toast("Complete your profile", {
            description: "Please fill out your profile information to continue.",
          });
          navigate("/profile");
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    } catch (error: any) {
      uiToast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid email or password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-lg mx-auto py-10 px-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>
            Sign in to your account or create a new profile
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email-login"
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
                  <Label htmlFor="password-login">Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password-login"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
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
                  {loading ? "Creating account..." : userRole === "agent" ? "Create Agent Account" : "Create Business Account"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
