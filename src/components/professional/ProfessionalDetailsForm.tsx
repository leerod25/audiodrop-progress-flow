
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const ProfessionalDetailsForm = ({ userId, initialData, onDetailsUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Define options
  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Italian',
    'Portuguese', 'Mandarin', 'Japanese', 'Arabic', 'Hindi'
  ];
  
  const specializedOptions = [
    'Customer Service', 'Data Entry', 'Technical Support', 'Virtual Assistant', 
    'Content Creation', 'Social Media Management', 'Transcription', 'Translation', 
    'Sales', 'Lead Generation', 'Appointment Setting', 'Email Support'
  ];
  
  const additionalOptions = [
    'Microsoft Office', 'Google Workspace', 'CRM Software', 'Photoshop', 
    'Video Editing', 'WordPress', 'Bookkeeping', 'Project Management', 
    'Research', 'Social Media Platforms', 'Email Marketing'
  ];
  
  const availabilityOptions = ['Full-time', 'Part-time', 'Weekends', 'Evenings', 'Mornings', 'Flexible'];

  // Set up the form
  const methods = useForm({
    defaultValues: {
      languages: initialData?.languages || [],
      specialized_skills: initialData?.specialized_skills || [],
      additional_skills: initialData?.additional_skills || [],
      years_experience: initialData?.years_experience || '',
      computer_skill_level: initialData?.computer_skill_level || '',
      availability: initialData?.availability || []
    }
  });

  const onSubmit = async (data) => {
    if (!userId) {
      toast.error('User ID is required to save professional details');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        user_id: userId,
        languages: data.languages || [],
        specialized_skills: data.specialized_skills || [],
        additional_skills: data.additional_skills || [],
        years_experience: data.years_experience,
        computer_skill_level: data.computer_skill_level,
        availability: data.availability || [],
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
      
    } catch (error) {
      console.error('Error updating professional details:', error);
      toast.error(error.message || 'Failed to update professional details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        {/* Years of Experience */}
        <FormField
          control={methods.control}
          name="years_experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
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
          control={methods.control}
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

        {/* Languages */}
        <FormField
          control={methods.control}
          name="languages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Languages Spoken</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-2">
                  {languageOptions.map(lang => (
                    <div key={lang} className="flex items-center">
                      <Checkbox
                        checked={field.value?.includes(lang)}
                        onCheckedChange={checked => {
                          const next = checked
                            ? [...(field.value || []), lang]
                            : (field.value || []).filter((v) => v !== lang);
                          field.onChange(next);
                        }}
                      />
                      <span className="ml-2">{lang}</span>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Specialized Skills */}
        <FormField
          control={methods.control}
          name="specialized_skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialized Skills</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-2">
                  {specializedOptions.map(skill => (
                    <div key={skill} className="flex items-center">
                      <Checkbox
                        checked={field.value?.includes(skill)}
                        onCheckedChange={checked => {
                          const next = checked
                            ? [...(field.value || []), skill]
                            : (field.value || []).filter((v) => v !== skill);
                          field.onChange(next);
                        }}
                      />
                      <span className="ml-2">{skill}</span>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Additional Skills */}
        <FormField
          control={methods.control}
          name="additional_skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Skills</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-2">
                  {additionalOptions.map(skill => (
                    <div key={skill} className="flex items-center">
                      <Checkbox
                        checked={field.value?.includes(skill)}
                        onCheckedChange={checked => {
                          const next = checked
                            ? [...(field.value || []), skill]
                            : (field.value || []).filter((v) => v !== skill);
                          field.onChange(next);
                        }}
                      />
                      <span className="ml-2">{skill}</span>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Availability */}
        <FormField
          control={methods.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-2">
                  {availabilityOptions.map(slot => (
                    <div key={slot} className="flex items-center">
                      <Checkbox
                        checked={field.value?.includes(slot)}
                        onCheckedChange={checked => {
                          const next = checked
                            ? [...(field.value || []), slot]
                            : (field.value || []).filter((v) => v !== slot);
                          field.onChange(next);
                        }}
                      />
                      <span className="ml-2">{slot}</span>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 text-right">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Public Details'
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ProfessionalDetailsForm;
