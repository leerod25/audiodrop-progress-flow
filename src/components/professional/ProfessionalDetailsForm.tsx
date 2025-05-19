
import React, { useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

interface ProfessionalDetailsFormProps {
  userId: string;
  initialData: any;
  onDetailsUpdate: (data: any) => Promise<boolean>;
}

interface FormValues {
  languages: string[];
  specialized_skills: string[];
  additional_skills: string[];
  availability: string[];
  years_experience?: string;
  computer_skill_level?: string;
}

const ProfessionalDetailsForm: React.FC<ProfessionalDetailsFormProps> = ({ 
  userId,
  initialData,
  onDetailsUpdate
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      languages: initialData?.languages || [],
      specialized_skills: initialData?.specialized_skills || [],
      additional_skills: initialData?.additional_skills || [],
      availability: initialData?.availability || [],
      years_experience: initialData?.years_experience || '',
      computer_skill_level: initialData?.computer_skill_level || ''
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

  const computerSkillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];

  const experienceLevels = [
    { label: 'Less than 1 year', value: 'less_than_1_year' },
    { label: '1-3 years', value: '1_3_years' },
    { label: '3-5 years', value: '3_5_years' },
    { label: '5-10 years', value: '5_10_years' },
    { label: 'More than 10 years', value: 'more_than_10_years' }
  ];

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      await onDetailsUpdate(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <SelectValue placeholder="Select your computer skill level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
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
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {experienceLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Professional Details'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfessionalDetailsForm;
