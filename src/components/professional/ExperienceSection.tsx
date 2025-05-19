
import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel,
  FormDescription
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export interface ExperienceSectionProps {
  experience: string;
  onExperienceChange: (years: string) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experience,
  onExperienceChange
}) => {
  return (
    <FormField
      name="yearsExperience"
      render={() => (
        <FormItem className="space-y-1">
          <FormLabel>Years of Experience</FormLabel>
          <FormDescription>
            Select the range that best describes your professional experience in this field
          </FormDescription>
          <RadioGroup 
            value={experience} 
            onValueChange={onExperienceChange}
            className="flex flex-col space-y-1"
          >
            {["<1", "1-2", "3-5", "6-10", "10+"].map((years) => (
              <div key={years} className="flex items-center space-x-2">
                <RadioGroupItem value={years} id={`years-${years}`} />
                <Label htmlFor={`years-${years}`}>
                  {years === "<1" ? "Less than 1 year" : 
                   years === "10+" ? "10+ years" : 
                   `${years} years`}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </FormItem>
      )}
    />
  );
};

export default ExperienceSection;
