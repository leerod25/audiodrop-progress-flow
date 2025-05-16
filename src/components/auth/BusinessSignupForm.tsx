
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import BusinessSignupFormFields, { 
  businessSignupSchema, 
  BusinessSignupFormValues 
} from "./BusinessSignupFormFields";
import TeamInviteDialog from "./TeamInviteDialog";

interface BusinessSignupFormProps {
  setErrorMessage: (message: string | null) => void;
  initialEmail?: string;
  initialPassword?: string;
}

const BusinessSignupForm = ({ 
  setErrorMessage, 
  initialEmail = "", 
  initialPassword = "" 
}: BusinessSignupFormProps) => {
  const [loading, setLoading] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();

  const form = useForm<BusinessSignupFormValues>({
    resolver: zodResolver(businessSignupSchema),
    defaultValues: {
      email: initialEmail,
      password: initialPassword,
      contactName: "",
      companyName: "",
      website: "",
      phone: "",
      country: "",
      city: "",
    },
  });

  const handleSignUp = async (values: BusinessSignupFormValues) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const { error, data } = await supabase.auth.signUp({ 
        email: values.email, 
        password: values.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            role: "business",
            full_name: values.contactName,
            company: values.companyName,
            website: values.website,
            phone: values.phone,
            country: values.country,
            city: values.city,
          }
        }
      });
      
      if (error) throw error;
      
      // Create role in dedicated table
      if (data.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ user_id: data.user.id, role: "business" });
        
        if (roleError) {
          console.error("Error setting user role:", roleError);
        }

        // Create/update profile with business information
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: values.contactName,
            email: values.email,
            phone: values.phone,
            country: values.country,
            city: values.city
          });

        if (profileError) {
          console.error("Error updating profile:", profileError);
        }
      }
      
      uiToast({
        title: "Business account created!",
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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignUp)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Business Information</h2>
                <TeamInviteDialog 
                  isOpen={isInviteDialogOpen} 
                  onOpenChange={setIsInviteDialogOpen} 
                />
              </div>
            </div>

            <BusinessSignupFormFields form={form} />
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating business account..." : "Create Business Account"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </>
  );
};

export default BusinessSignupForm;
