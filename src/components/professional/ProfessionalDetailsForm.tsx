
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
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
import { supabase } from '@/integrations/supabase/client';

interface ProfessionalDetailsFormProps {
  userId: string;
  initialData: any;
  onDetailsUpdate: (data: any) => void;
}

interface FormValues {
  languages: string[];
  specialized_skills: string[];
  additional_skills: string[];
  availability: string[];
  years_experience?: string;
}

export const ProfessionalDetailsForm: React.FC<ProfessionalDetailsFormProps> = ({ 
  userId,
  initialData,
  onDetailsUpdate
}) => {
  const form = useForm<FormValues>({
    defaultValues: {
      languages: initialData?.languages || [],
      specialized_skills: initialData?.specialized_skills || [],
      additional_skills: initialData?.additional_skills || [],
      availability: initialData?.availability || [],
      years_experience: initialData?.years_experience || ''
    }
  });
  
  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Italian',
    'Portuguese', 'Mandarin', 'Japanese', 'Arabic', 'Hindi'
  ];
  
  const specializedOptions = [
    'React', 'Next.js', 'Node.js', 'Python', 'Django',
    'AWS', 'Docker', 'Kubernetes'
  ];
  
  const additionalOptions = [
    'GraphQL', 'REST APIs', 'SQL', 'NoSQL', 'CI/CD',
    'Unit Testing', 'Accessibility', 'Performance Tuning'
  ];
  
  const availabilityOptions = ['Full-time', 'Part-time', 'Weekends', 'Evenings'];

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      // Update the professional details in the profiles table
      const { error } = await supabase
        .from("profiles")
        .update({
          languages: data.languages,
          specialized_skills: data.specialized_skills,
          additional_skills: data.additional_skills,
          availability: data.availability,
          years_experience: data.years_experience
        })
        .eq("id", userId);

      if (error) throw error;
      
      // Call the callback function to update state
      onDetailsUpdate(data);
    } catch (error) {
      console.error("Error updating professional details:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Languages */}
        <FormField
          control={form.control}
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
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...(field.value || []), lang]
                            : (field.value || []).filter(v => v !== lang);
                          field.onChange(updatedValue);
                        }}
                      />
                      <span className="ml-2">{lang}</span>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage/>
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
                <div className="grid grid-cols-2 gap-2">
                  {specializedOptions.map(skill => (
                    <div key={skill} className="flex items-center">
                      <Checkbox
                        checked={field.value?.includes(skill)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...(field.value || []), skill]
                            : (field.value || []).filter(v => v !== skill);
                          field.onChange(updatedValue);
                        }}
                      />
                      <span className="ml-2">{skill}</span>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage/>
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
                <div className="grid grid-cols-2 gap-2">
                  {additionalOptions.map(skill => (
                    <div key={skill} className="flex items-center">
                      <Checkbox
                        checked={field.value?.includes(skill)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...(field.value || []), skill]
                            : (field.value || []).filter(v => v !== skill);
                          field.onChange(updatedValue);
                        }}
                      />
                      <span className="ml-2">{skill}</span>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage/>
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
                <div className="grid grid-cols-2 gap-2">
                  {availabilityOptions.map(slot => (
                    <div key={slot} className="flex items-center">
                      <Checkbox
                        checked={field.value?.includes(slot)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...(field.value || []), slot]
                            : (field.value || []).filter(v => v !== slot);
                          field.onChange(updatedValue);
                        }}
                      />
                      <span className="ml-2">{slot}</span>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <div className="mt-4 text-right">
          <Button type="submit">Save Public Details</Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfessionalDetailsForm;
