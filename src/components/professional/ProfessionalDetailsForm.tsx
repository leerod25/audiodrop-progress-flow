
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useUserContext } from '@/contexts/UserContext';
import { Form } from '@/components/ui/form';
import ExperienceSection from './ExperienceSection';
import LanguagesSection from './LanguagesSection';
import SkillsSection from './SkillsSection';
import ComputerSkillsSection from './ComputerSkillsSection';
import AvailabilitySection from './AvailabilitySection';
import SalarySection from './SalarySection';

interface ProfessionalDetailsForm {
  yearsExperience: string;
  languages: string[];
  skills: string[];
  additionalSkills: string[];
  availability: string[];
  computerSkillLevel: string;
  salaryExpectation: string;
}

export interface ProfessionalDetails {
  id?: string;
  user_id: string;
  years_experience: string;
  languages: string[];
  specialized_skills?: string[];
  additional_skills?: string[];
  availability?: string[];
  computer_skill_level?: string;
  salary_expectation?: string;
  created_at?: string;
  updated_at?: string;
}

const ProfessionalDetailsForm = () => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [yearsExperience, setYearsExperience] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [specializedSkills, setSpecializedSkills] = useState<string[]>([]);
  const [additionalSkills, setAdditionalSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [computerSkillLevel, setComputerSkillLevel] = useState('');
  const [salaryExpectation, setSalaryExpectation] = useState('');
  const [detailsId, setDetailsId] = useState<string | null>(null);
  
  const form = useForm<ProfessionalDetailsForm>({
    defaultValues: {
      yearsExperience: '',
      languages: [],
      skills: [],
      additionalSkills: [],
      availability: [],
      computerSkillLevel: '',
      salaryExpectation: ''
    },
  });

  // Fetch existing professional details on mount
  useEffect(() => {
    if (user?.id) {
      fetchProfessionalDetails(user.id);
    }
  }, [user?.id]);

  // Function to fetch professional details
  const fetchProfessionalDetails = async (userId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('professional_details')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching professional details:', error);
        toast.error('Failed to load professional details');
        return;
      }
      
      if (data) {
        // Populate state with fetched data
        setDetailsId(data.id);
        setYearsExperience(data.years_experience || '');
        setLanguages(data.languages || []);
        setSpecializedSkills(data.specialized_skills || []);
        setAdditionalSkills(data.additional_skills || []);
        setAvailability(data.availability || []);
        setComputerSkillLevel(data.computer_skill_level || '');
        setSalaryExpectation(data.salary_expectation || '');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Function to save professional details
  const onSubmit = async () => {
    if (!user?.id) {
      toast.error('You must be logged in to save professional details');
      return;
    }
    
    try {
      setLoading(true);
      
      const professionalDetails: ProfessionalDetails = {
        user_id: user.id,
        years_experience: yearsExperience,
        languages,
        specialized_skills: specializedSkills,
        additional_skills: additionalSkills,
        availability,
        computer_skill_level: computerSkillLevel,
        salary_expectation: salaryExpectation,
      };
      
      let result;
      
      if (detailsId) {
        // Update existing record
        result = await supabase
          .from('professional_details')
          .update(professionalDetails)
          .eq('id', detailsId);
      } else {
        // Insert new record
        result = await supabase
          .from('professional_details')
          .insert(professionalDetails)
          .select();
      }
      
      if (result.error) {
        console.error('Error saving professional details:', result.error);
        toast.error('Failed to save professional details');
        return;
      }
      
      // If this was a new insert, store the ID
      if (result.data && result.data[0]?.id) {
        setDetailsId(result.data[0].id);
      }
      
      toast.success('Professional details saved successfully');
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Update functions
  const updateLanguages = (newLanguages: string[]) => setLanguages(newLanguages);
  const updateSpecializedSkills = (newSkills: string[]) => setSpecializedSkills(newSkills);
  const updateAdditionalSkills = (newSkills: string[]) => setAdditionalSkills(newSkills);
  const updateYearsExperience = (years: string) => setYearsExperience(years);
  const updateComputerSkillLevel = (level: string) => setComputerSkillLevel(level);
  const updateAvailability = (newAvailability: string[]) => setAvailability(newAvailability);
  const updateSalaryExpectation = (salary: string) => setSalaryExpectation(salary);

  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* Languages Section */}
        <LanguagesSection
          languages={languages}
          onLanguagesChange={updateLanguages}
        />
        
        {/* Skills Section */}
        <SkillsSection
          specializedSkills={specializedSkills}
          additionalSkills={additionalSkills}
          onSpecializedSkillsChange={updateSpecializedSkills}
          onAdditionalSkillsChange={updateAdditionalSkills}
        />
        
        {/* Experience Section */}
        <ExperienceSection
          experience={yearsExperience}
          onExperienceChange={updateYearsExperience}
        />
        
        {/* Computer Skills Section */}
        <ComputerSkillsSection
          skillLevel={computerSkillLevel}
          onSkillLevelChange={updateComputerSkillLevel}
        />
        
        {/* Availability Section */}
        <AvailabilitySection
          availability={availability}
          onAvailabilityChange={updateAvailability}
        />
        
        {/* Salary Expectation Section */}
        <SalarySection
          salaryExpectation={salaryExpectation}
          onSalaryExpectationChange={updateSalaryExpectation}
        />
        
        {/* Submit Button */}
        <Button 
          type="button"
          onClick={onSubmit}
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Professional Details'}
        </Button>
      </form>
    </Form>
  );
};

export default ProfessionalDetailsForm;
