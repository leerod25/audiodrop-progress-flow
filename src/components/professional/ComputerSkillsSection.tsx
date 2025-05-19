
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Computer } from "lucide-react";

interface ComputerSkillsSectionProps {
  skillLevel: string;
  onChange: (skillLevel: string) => void;
}

const ComputerSkillsSection = ({ skillLevel, onChange }: ComputerSkillsSectionProps) => {
  const skillLevels = [
    {
      id: 'beginner',
      label: 'Beginner',
      description: 'Can browse the internet, check emails, and use basic applications like word processors. Familiar with fundamental computer operations and simple file management.'
    },
    {
      id: 'intermediate',
      label: 'Intermediate',
      description: 'Comfortable with various software applications, spreadsheet manipulation, online collaboration tools, and basic troubleshooting. Can learn new applications quickly and adapt to different systems.'
    },
    {
      id: 'advanced',
      label: 'Advanced',
      description: 'Proficient with CRM systems, project management software, and advanced data analysis tools. Can quickly master complex applications, manage databases, and customize software settings for optimal performance.'
    },
    {
      id: 'expert',
      label: 'Expert',
      description: 'Highly skilled with enterprise-level systems, specialized industry software, automation tools, and advanced data processing. Can develop macros, create workflows, integrate systems, and provide technical support to others.'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Computer className="h-4 w-4 text-muted-foreground" />
        <Label className="text-lg font-medium">Computer Skills</Label>
      </div>
      <RadioGroup 
        value={skillLevel} 
        onValueChange={onChange}
        className="space-y-4"
      >
        {skillLevels.map(level => (
          <div key={level.id} className="flex items-start space-x-3 p-3 border rounded-md hover:bg-slate-50">
            <RadioGroupItem value={level.id} id={level.id + "_level"} className="mt-1" />
            <div className="space-y-1">
              <Label htmlFor={level.id + "_level"} className="font-medium">{level.label}</Label>
              <p className="text-sm text-muted-foreground">{level.description}</p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ComputerSkillsSection;
