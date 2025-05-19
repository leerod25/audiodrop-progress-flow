
import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel,
  FormDescription
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export interface ComputerSkillsSectionProps {
  skillLevel: string;
  onSkillLevelChange: (level: string) => void;
}

const ComputerSkillsSection: React.FC<ComputerSkillsSectionProps> = ({
  skillLevel,
  onSkillLevelChange
}) => {
  const skillLevels = [
    { value: 'beginner', label: 'Beginner - Basic computer skills' },
    { value: 'intermediate', label: 'Intermediate - Comfortable with most applications' },
    { value: 'advanced', label: 'Advanced - Proficient in many applications' },
    { value: 'expert', label: 'Expert - Can learn any application quickly' }
  ];

  return (
    <FormField
      name="computerSkillLevel"
      render={() => (
        <FormItem className="space-y-1">
          <FormLabel>Computer Skill Level</FormLabel>
          <FormDescription>
            How would you rate your computer proficiency?
          </FormDescription>
          <RadioGroup 
            value={skillLevel} 
            onValueChange={onSkillLevelChange}
            className="flex flex-col space-y-1"
          >
            {skillLevels.map((level) => (
              <div key={level.value} className="flex items-center space-x-2">
                <RadioGroupItem value={level.value} id={`skill-${level.value}`} />
                <Label htmlFor={`skill-${level.value}`}>
                  {level.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </FormItem>
      )}
    />
  );
};

export default ComputerSkillsSection;
