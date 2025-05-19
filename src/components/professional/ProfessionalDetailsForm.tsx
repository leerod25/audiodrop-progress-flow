
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";

import { ProfessionalDetailsData, ProfessionalDetailsFormProps } from './types';
import LanguagesSection from './LanguagesSection';
import SkillsSection from './SkillsSection';
import ExperienceSection from './ExperienceSection';
import ComputerSkillsSection from './ComputerSkillsSection';
import AvailabilitySection from './AvailabilitySection';
import SalarySection from './SalarySection';

const ProfessionalDetailsForm = ({ userId }: ProfessionalDetailsFormProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProfessionalDetailsData>({
    languages: [],
    specialized_skills: [],
    additional_skills: [],
    years_experience: '',
    availability: [],
    salary_expectation: 500, // Default to 500 USD
    computer_skill_level: '',
  });

  const form = useForm<ProfessionalDetailsData>({
    defaultValues: data,
  });

  useEffect(() => {
    const fetchProfessionalDetails = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('professional_details')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching professional details:", error);
          toast.error("Failed to load professional data.");
        }

        if (data) {
          const formattedData = {
            languages: data.languages || [],
            specialized_skills: data.specialized_skills || [],
            additional_skills: data.additional_skills || [],
            years_experience: data.years_experience || '',
            availability: data.availability || [],
            salary_expectation: data.salary_expectation || 500, // Default to 500 if null
            computer_skill_level: data.computer_skill_level || '',
          };
          
          setData(formattedData);
          form.reset(formattedData);
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfessionalDetails();
    }
  }, [userId, form]);

  const onSubmit = async (formData: ProfessionalDetailsData) => {
    setLoading(true);
    try {
      // First check if the user already has a professional details record
      const { data: existingData, error: checkError } = await supabase
        .from('professional_details')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking existing professional details:", checkError);
        toast.error("Failed to update professional details.");
        return;
      }
      
      let error;
      
      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('professional_details')
          .update({
            languages: formData.languages,
            specialized_skills: formData.specialized_skills,
            additional_skills: formData.additional_skills,
            years_experience: formData.years_experience,
            availability: formData.availability,
            salary_expectation: formData.salary_expectation,
            computer_skill_level: formData.computer_skill_level,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);
        
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('professional_details')
          .insert({
            user_id: userId,
            languages: formData.languages,
            specialized_skills: formData.specialized_skills,
            additional_skills: formData.additional_skills,
            years_experience: formData.years_experience,
            availability: formData.availability,
            salary_expectation: formData.salary_expectation,
            computer_skill_level: formData.computer_skill_level,
            updated_at: new Date().toISOString(),
          });
        
        error = insertError;
      }

      if (error) {
        console.error("Error updating professional details:", error);
        toast.error("Failed to update professional details.");
      } else {
        toast.success("Professional details updated successfully!");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ProfessionalFormSkeleton />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <LanguagesSection 
          languages={data.languages} 
          onChange={(languages) => setData({...data, languages})} 
        />

        <SkillsSection 
          title="Specialized Skills"
          skills={data.specialized_skills}
          options={[
            { id: 'outbound-lead-gen', label: 'Outbound Lead Generation' },
            { id: 'appointment-setting', label: 'Appointment Setting' },
            { id: 'virtual-assistant', label: 'Virtual Assistant' },
          ]}
          onChange={(specialized_skills) => setData({...data, specialized_skills})}
        />

        <SkillsSection 
          title="Additional Skills"
          skills={data.additional_skills}
          options={[
            { id: 'customer-service', label: 'Customer Service' },
            { id: 'technical-support', label: 'Technical Support' },
            { id: 'sales', label: 'Sales' },
            { id: 'collections', label: 'Collections' },
            { id: 'healthcare', label: 'Healthcare' },
            { id: 'multilingual', label: 'Multilingual' },
          ]}
          onChange={(additional_skills) => setData({...data, additional_skills})}
        />

        <ExperienceSection 
          experience={data.years_experience} 
          onChange={(years_experience) => setData({...data, years_experience})}
        />

        <ComputerSkillsSection 
          skillLevel={data.computer_skill_level} 
          onChange={(computer_skill_level) => setData({...data, computer_skill_level})}
        />

        <AvailabilitySection 
          availability={data.availability} 
          onChange={(availability) => setData({...data, availability})}
        />

        <SalarySection 
          salary={data.salary_expectation}
          onChange={(salary_expectation) => setData({...data, salary_expectation})}
        />

        <Button type="submit" disabled={loading}>
          Update Professional Details
        </Button>
      </form>
    </Form>
  );
};

// Skeleton loader component for the form
const ProfessionalFormSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-6"
  >
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="grid grid-cols-1 gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
    </div>

    <Skeleton className="h-10 w-[100px]" />
  </motion.div>
);

export default ProfessionalDetailsForm;
