
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useUserContext } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, DollarSign } from 'lucide-react';

// Define the form schema with Zod
const profileFormSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  country: z.string().min(1, 'Please select a country'),
  city: z.string().optional(),
  gender: z.string().optional(),
  years_experience: z.string().optional(),
  email: z.string().email('Please enter a valid email').optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  salary_expectation: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// List of countries for the select
const countries = [
  'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Colombia', 
  'United Kingdom', 'France', 'Germany', 'Spain', 'Italy', 'Netherlands',
  'India', 'China', 'Japan', 'South Korea', 'Australia', 'New Zealand',
  'South Africa', 'Nigeria', 'Egypt', 'Saudi Arabia', 'United Arab Emirates',
  'El Salvador', 'Guatemala', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama'
];

interface ProfileFormProps {
  userId?: string;
  initialData?: any;
  onProfileUpdate?: (data: any) => void;
}

export default function ProfileForm({ userId, initialData, onProfileUpdate }: ProfileFormProps) {
  const { user } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [professionalDetails, setProfessionalDetails] = useState<any>(null);

  // Initialize the form with react-hook-form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: '',
      bio: '',
      country: '',
      city: '',
      gender: '',
      years_experience: '',
      email: '',
      phone: '',
      whatsapp: '',
      salary_expectation: '',
    },
  });

  // Fetch professional details to get the salary expectation
  useEffect(() => {
    const fetchProfessionalDetails = async () => {
      if (!userId && !user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('professional_details')
          .select('*')
          .eq('user_id', userId || user?.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching professional details:', error);
          return;
        }
        
        if (data) {
          setProfessionalDetails(data);
          // Update form with salary expectation if available
          form.setValue('salary_expectation', data.salary_expectation ? String(data.salary_expectation) : '');
        }
      } catch (err) {
        console.error('Error in fetchProfessionalDetails:', err);
      }
    };
    
    fetchProfessionalDetails();
  }, [userId, user, form]);

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        full_name: initialData.full_name || '',
        bio: initialData.bio || '',
        country: initialData.country || '',
        city: initialData.city || '',
        gender: initialData.gender || '',
        years_experience: initialData.years_experience || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        whatsapp: initialData.whatsapp || '',
        salary_expectation: professionalDetails?.salary_expectation ? String(professionalDetails.salary_expectation) : '',
      });
    }
  }, [initialData, form, professionalDetails]);

  // Handle form submission
  async function onSubmit(data: ProfileFormValues) {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    setIsLoading(true);
    try {
      // Update the profile table
      const { data: profileData, error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          bio: data.bio,
          country: data.country,
          city: data.city,
          gender: data.gender,
          years_experience: data.years_experience,
          email: data.email,
          phone: data.phone,
          whatsapp: data.whatsapp,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId || user.id)
        .select();

      if (error) throw error;
      
      // Update the professional_details table with salary_expectation
      const salaryValue = data.salary_expectation ? parseFloat(data.salary_expectation) : null;
      
      const { data: existingDetails } = await supabase
        .from('professional_details')
        .select('id')
        .eq('user_id', userId || user.id)
        .maybeSingle();
        
      if (existingDetails) {
        // Update existing record
        const { error: salaryError } = await supabase
          .from('professional_details')
          .update({
            salary_expectation: salaryValue,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId || user.id);
          
        if (salaryError) {
          console.error('Error updating salary expectation:', salaryError);
          toast.error('Failed to update salary information');
        }
      } else if (salaryValue) {
        // Create new record if salary is provided
        const { error: insertError } = await supabase
          .from('professional_details')
          .insert({
            user_id: userId || user.id,
            salary_expectation: salaryValue,
            updated_at: new Date().toISOString(),
          });
          
        if (insertError) {
          console.error('Error creating salary expectation record:', insertError);
          toast.error('Failed to save salary information');
        }
      }
      
      toast.success('Profile updated successfully');
      
      if (onProfileUpdate && profileData?.[0]) {
        onProfileUpdate(profileData[0]);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information and preferences (Private - Only visible to you and admins)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us a bit about yourself" 
                      className="resize-none" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Your city" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Non-binary">Non-binary</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="years_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0-1">Less than 1 year</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Salary Expectation */}
            <FormField
              control={form.control}
              name="salary_expectation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Salary Expectation (USD)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-2.5 h-5 w-5 text-gray-500" />
                      <Input 
                        type="number" 
                        placeholder="500" 
                        className="pl-9" 
                        {...field} 
                        value={field.value || ''} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Your email" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="Your WhatsApp number" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="px-0 pt-4">
              <Button type="submit" disabled={isLoading} className="ml-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
