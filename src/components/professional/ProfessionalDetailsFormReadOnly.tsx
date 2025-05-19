
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ProfessionalDetails } from './types';
import LanguagesSection from './readonly/LanguagesSection';
import ExperienceSection from './readonly/ExperienceSection';
import SkillsSection from './readonly/SkillsSection';
import ComputerSkillsSection from './readonly/ComputerSkillsSection';
import AvailabilitySection from './readonly/AvailabilitySection';

interface ProfessionalDetailsFormReadOnlyProps {
  professionalDetails: ProfessionalDetails | null;
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
      <ExperienceSection yearsExperience={professionalDetails.years_experience || ''} />
      
      <LanguagesSection languages={professionalDetails.languages || []} />
      
      <SkillsSection skills={professionalDetails.skills || []} />
      
      <ComputerSkillsSection computerSkills={professionalDetails.computer_skills || []} />
      
      <AvailabilitySection 
        availableWeekends={professionalDetails.available_weekends}
        availableNights={professionalDetails.available_nights}
        availableFullTime={professionalDetails.available_full_time}
        preferredSchedule={professionalDetails.preferred_schedule || ''}
      />
    </div>
  );
};

export default ProfessionalDetailsFormReadOnly;
