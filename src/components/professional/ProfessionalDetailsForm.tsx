
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
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { MultiSelect, Option } from '@/components/ui/multi-select';
import SalarySection from '@/components/professional/SalarySection';

// Define the form schema with Zod
const professionalDetailsSchema = z.object({
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  specialized_skills: z.array(z.string()).optional(),
  additional_skills: z.array(z.string()).optional(),
  years_experience: z.string().min(1, 'Please select your years of experience'),
  computer_skill_level: z.string().min(1, 'Please select your computer skill level'),
  availability: z.array(z.string()).optional(),
  salary_expectation: z.string().optional(),
});

type ProfessionalDetailsValues = z.infer<typeof professionalDetailsSchema>;

interface ProfessionalDetailsFormProps {
  userId: string;
  initialData?: any;
  onDetailsUpdate?: (data: any) => void;
}

const languageOptions: Option[] = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Portuguese', label: 'Portuguese' },
  { value: 'Italian', label: 'Italian' },
  { value: 'Russian', label: 'Russian' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Korean', label: 'Korean' },
  { value: 'Arabic', label: 'Arabic' },
];

const skillOptions: Option[] = [
  { value: 'Customer Service', label: 'Customer Service' },
  { value: 'Data Entry', label: 'Data Entry' },
  { value: 'Technical Support', label: 'Technical Support' },
  { value: 'Virtual Assistant', label: 'Virtual Assistant' },
  { value: 'Content Creation', label: 'Content Creation' },
  { value: 'Social Media Management', label: 'Social Media Management' },
  { value: 'Transcription', label: 'Transcription' },
  { value: 'Translation', label: 'Translation' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Lead Generation', label: 'Lead Generation' },
  { value: 'Appointment Setting', label: 'Appointment Setting' },
  { value: 'Email Support', label: 'Email Support' },
];

const additionalSkillOptions: Option[] = [
  { value: 'Microsoft Office', label: 'Microsoft Office' },
  { value: 'Google Workspace', label: 'Google Workspace' },
  { value: 'CRM Software', label: 'CRM Software' },
  { value: 'Photoshop', label: 'Photoshop' },
  { value: 'Video Editing', label: 'Video Editing' },
  { value: 'WordPress', label: 'WordPress' },
  { value: 'Bookkeeping', label: 'Bookkeeping' },
  { value: 'Project Management', label: 'Project Management' },
  { value: 'Research', label: 'Research' },
  { value: 'Social Media Platforms', label: 'Social Media Platforms' },
  { value: 'Email Marketing', label: 'Email Marketing' },
];

const availabilityOptions: Option[] = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Weekends', label: 'Weekends' },
  { value: 'Weekdays', label: 'Weekdays' },
  { value: 'Evenings', label: 'Evenings' },
  { value: 'Mornings', label: 'Mornings' },
  { value: 'Flexible', label: 'Flexible' },
];

const ProfessionalDetailsForm: React.FC<ProfessionalDetailsFormProps> = ({ userId, initialData, onDetailsUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form with react-hook-form
  const form = useForm<ProfessionalDetailsValues>({
    resolver: zodResolver(professionalDetailsSchema),
    defaultValues: {
      languages: [],
      specialized_skills: [],
      additional_skills: [],
      years_experience: '',
      computer_skill_level: '',
      availability: [],
      salary_expectation: '',
    },
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        languages: Array.isArray(initialData.languages) ? initialData.languages : [],
        specialized_skills: Array.isArray(initialData.specialized_skills) ? initialData.specialized_skills : [],
        additional_skills: Array.isArray(initialData.additional_skills) ? initialData.additional_skills : [],
        years_experience: initialData.years_experience || '',
        computer_skill_level: initialData.computer_skill_level || '',
        availability: Array.isArray(initialData.availability) ? initialData.availability : [],
        salary_expectation: initialData.salary_expectation ? String(initialData.salary_expectation) : '',
      });
    }
  }, [initialData, form]);

  // Handle form submission
  async function onSubmit(data: ProfessionalDetailsValues) {
    if (!userId) {
      toast.error('User ID is required to save professional details');
      return;
    }

    setIsLoading(true);
    try {
      const salaryValue = data.salary_expectation ? parseFloat(data.salary_expectation) : null;
      
      const payload = {
        user_id: userId,
        languages: data.languages || [],
        specialized_skills: data.specialized_skills || [],
        additional_skills: data.additional_skills || [],
        years_experience: data.years_experience,
        computer_skill_level: data.computer_skill_level,
        availability: data.availability || [],
        salary_expectation: salaryValue,
        updated_at: new Date().toISOString(),
      };

      // Check if the record exists
      const { data: existingData, error: checkError } = await supabase
        .from('professional_details')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let result;
      if (existingData?.id) {
        // Update if record exists
        result = await supabase
          .from('professional_details')
          .update(payload)
          .eq('user_id', userId)
          .select();
      } else {
        // Insert if no record exists
        result = await supabase
          .from('professional_details')
          .insert(payload)
          .select();
      }

      if (result.error) {
        throw result.error;
      }

      toast.success('Professional details updated successfully');
      
      if (onDetailsUpdate && result.data?.[0]) {
        onDetailsUpdate(result.data[0]);
      }
      
    } catch (error: any) {
      console.error('Error updating professional details:', error);
      toast.error(error.message || 'Failed to update professional details');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Languages */}
            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={languageOptions}
                      selected={field.value || []}
                      onChange={field.onChange}
                      placeholder="Select languages"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Years of Experience */}
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

            {/* Computer Skill Level */}
            <FormField
              control={form.control}
              name="computer_skill_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Computer Skill Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select skill level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Specialized Skills */}
            <FormField
              control={form.control}
              name="specialized_skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialized Skills</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={skillOptions}
                      selected={field.value || []}
                      onChange={field.onChange}
                      placeholder="Select your specialized skills"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Skills */}
            <FormField
              control={form.control}
              name="additional_skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Skills</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={additionalSkillOptions}
                      selected={field.value || []}
                      onChange={field.onChange}
                      placeholder="Select additional skills"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Availability */}
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={availabilityOptions}
                      selected={field.value || []}
                      onChange={field.onChange}
                      placeholder="Select your availability"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Salary Expectations */}
            <SalarySection control={form.control} />

            <Button type="submit" disabled={isLoading} className="mt-4">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Professional Details'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfessionalDetailsForm;
