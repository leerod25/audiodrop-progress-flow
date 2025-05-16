
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Key, Briefcase, Globe, Phone, Building, MapPin, User as UserCircle } from "lucide-react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface BusinessSignupFormProps {
  setErrorMessage: (message: string | null) => void;
}

const phoneRegex = /^(\+?1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

const businessSignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  contactName: z.string().min(2, "Full name is required"),
  companyName: z.string().min(2, "Company name is required"),
  website: z.string().url("Please enter a valid website URL").or(z.string().length(0)),
  phone: z.string().regex(phoneRegex, "Please enter a valid US or Canadian phone number"),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
});

type BusinessSignupFormValues = z.infer<typeof businessSignupSchema>;

const BusinessSignupForm = ({ setErrorMessage }: BusinessSignupFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();

  const form = useForm<BusinessSignupFormValues>({
    resolver: zodResolver(businessSignupSchema),
    defaultValues: {
      email: "",
      password: "",
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignUp)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Business Information</h2>
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="business@example.com"
                        className="pl-10"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type="password"
                        className="pl-10"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 6 characters long
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person Name</FormLabel>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="Jane Smith"
                        className="pl-10"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="Acme Corporation"
                        className="pl-10"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Website (Optional)</FormLabel>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="https://www.example.com"
                        className="pl-10"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="USA"
                          className="pl-10"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="New York"
                          className="pl-10"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (US or Canada)</FormLabel>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="(555) 123-4567"
                        className="pl-10"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
            <p className="text-amber-800 text-sm">
              After sign up, you'll be able to post jobs and search for agents.
            </p>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating business account..." : "Create Business Account"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};

export default BusinessSignupForm;
