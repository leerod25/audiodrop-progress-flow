
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import LanguagesSection from './readonly/LanguagesSection';
import ExperienceSection from './readonly/ExperienceSection';
import SkillsSection from './readonly/SkillsSection';
import ComputerSkillsSection from './readonly/ComputerSkillsSection';
import AvailabilitySection from './readonly/AvailabilitySection';
import { ProfessionalDetailsData } from './types';

interface ProfessionalDetailsFormReadOnlyProps {
  userId: string;
}

const ProfessionalDetailsFormReadOnly = ({ userId }: ProfessionalDetailsFormReadOnlyProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProfessionalDetailsData>({
    languages: [],
    specialized_skills: [],
    additional_skills: [],
    years_experience: '',
    availability: [],
    computer_skill_level: '',
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
        }

        if (data) {
          const formattedData = {
            languages: data.languages || [],
            specialized_skills: data.specialized_skills || [],
            additional_skills: data.additional_skills || [],
            years_experience: data.years_experience || '',
            availability: data.availability || [],
            computer_skill_level: data.computer_skill_level || '',
          };
          
          setData(formattedData);
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfessionalDetails();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2">
      <LanguagesSection languages={data.languages} />
      <ExperienceSection experience={data.years_experience} />
      <SkillsSection 
        specializedSkills={data.specialized_skills}
        additionalSkills={data.additional_skills}
      />
      <ComputerSkillsSection skillLevel={data.computer_skill_level} />
      <AvailabilitySection availability={data.availability} />
    </div>
  );
};

export default ProfessionalDetailsFormReadOnly;
