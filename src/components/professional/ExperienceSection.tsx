
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "lucide-react";

interface ExperienceSectionProps {
  experience: string;
  onChange: (experience: string) => void;
}

const ExperienceSection = ({ experience, onChange }: ExperienceSectionProps) => {
  const experienceOptions = [
    { id: 'less_than_1_year', label: 'Less than 1 year' },
    { id: '1_3_years', label: '1-3 years' },
    { id: '3_5_years', label: '3-5 years' },
    { id: '5_10_years', label: '5-10 years' },
    { id: 'more_than_10_years', label: 'More than 10 years' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Label className="text-lg font-medium">Years of Experience</Label>
      </div>
      <RadioGroup 
        value={experience} 
        onValueChange={onChange}
        className="grid grid-cols-2 gap-4"
      >
        {experienceOptions.map(option => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem value={option.id} id={option.id} />
            <Label htmlFor={option.id}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ExperienceSection;
