
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ProfessionalDetailsData } from './types';
import LanguagesSection from './readonly/LanguagesSection';
import ExperienceSection from './readonly/ExperienceSection';
import SkillsSection from './readonly/SkillsSection';
import ComputerSkillsSection from './readonly/ComputerSkillsSection';
import AvailabilitySection from './readonly/AvailabilitySection';

interface ProfessionalDetailsFormReadOnlyProps {
  professionalDetails: ProfessionalDetailsData | null;
}

const ProfessionalDetailsFormReadOnly: React.FC<ProfessionalDetailsFormReadOnlyProps> = ({ 
  professionalDetails 
}) => {
  if (!professionalDetails) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">No professional details available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <ExperienceSection experience={professionalDetails.years_experience || ''} />
      
      <LanguagesSection languages={professionalDetails.languages || []} />
      
      <SkillsSection 
        specializedSkills={professionalDetails.specialized_skills || []} 
        additionalSkills={professionalDetails.additional_skills || []}
      />
      
      <ComputerSkillsSection level={professionalDetails.computer_skill_level || ''} />
      
      <AvailabilitySection 
        availability={professionalDetails.availability || []}
      />
    </div>
  );
};

export default ProfessionalDetailsFormReadOnly;
