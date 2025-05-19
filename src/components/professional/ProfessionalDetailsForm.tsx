
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ProfessionalDetailsData, ProfessionalDetailsFormProps } from './types';
import LanguagesSection from './LanguagesSection';
import SkillsSection from './SkillsSection';
import ExperienceSection from './ExperienceSection';
import ComputerSkillsSection from './ComputerSkillsSection';
import AvailabilitySection from './AvailabilitySection';

const ProfessionalDetailsForm = ({ userId }: ProfessionalDetailsFormProps) => {
  const [formData, setFormData] = useState<ProfessionalDetailsData>({
    languages: [],
    specialized_skills: [],
    additional_skills: [],
    years_experience: '',
    availability: [],
    computer_skill_level: '',
  });
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  // Fetch existing professional details
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
          toast.error("Failed to load professional details");
        }

        if (data) {
          setFormData({
            languages: data.languages || [],
            specialized_skills: data.specialized_skills || [],
            additional_skills: data.additional_skills || [],
            years_experience: data.years_experience || '',
            availability: data.availability || [],
            computer_skill_level: data.computer_skill_level || '',
          });
        }
      } catch (error) {
        console.error("Error in fetching professional details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfessionalDetails();
    }
  }, [userId]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('professional_details')
        .upsert({
          user_id: userId,
          languages: formData.languages,
          specialized_skills: formData.specialized_skills,
          additional_skills: formData.additional_skills,
          years_experience: formData.years_experience,
          availability: formData.availability,
          computer_skill_level: formData.computer_skill_level,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error("Error saving professional details:", error);
        toast.error("Failed to save professional details");
      } else {
        toast.success("Professional details saved successfully");
        setFormChanged(false);
      }
    } catch (error) {
      console.error("Error in saving professional details:", error);
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  // Update form data
  const updateFormData = (key: keyof ProfessionalDetailsData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setFormChanged(true);
  };

  if (loading) {
    return <div>Loading professional details...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <LanguagesSection 
              languages={formData.languages} 
              updateLanguages={(languages) => updateFormData('languages', languages)} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <SkillsSection 
              specializedSkills={formData.specialized_skills}
              additionalSkills={formData.additional_skills}
              updateSpecializedSkills={(skills) => updateFormData('specialized_skills', skills)}
              updateAdditionalSkills={(skills) => updateFormData('additional_skills', skills)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <ExperienceSection 
              yearsExperience={formData.years_experience} 
              updateYearsExperience={(years) => updateFormData('years_experience', years)} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <ComputerSkillsSection 
              computerSkillLevel={formData.computer_skill_level} 
              updateComputerSkillLevel={(level) => updateFormData('computer_skill_level', level)} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <AvailabilitySection 
              availability={formData.availability} 
              updateAvailability={(availability) => updateFormData('availability', availability)} 
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving || !formChanged}>
            {isSaving ? "Saving..." : "Save Professional Details"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProfessionalDetailsForm;
