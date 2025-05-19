
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase } from "lucide-react";

interface SkillsSectionProps {
  title: string;
  skills: string[];
  options: { id: string, label: string }[];
  onChange: (skills: string[]) => void;
}

const SkillsSection = ({ title, skills, options, onChange }: SkillsSectionProps) => {
  const handleCheckboxChange = (skill: string, checked: boolean) => {
    const newSkills = checked 
      ? [...skills, skill] 
      : skills.filter(s => s !== skill);
    onChange(newSkills);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Briefcase className="h-4 w-4 text-muted-foreground" />
        <Label className="text-lg font-medium">{title}</Label>
      </div>
      <div className={`grid ${title === "Additional Skills" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"} gap-4`}>
        {options.map(option => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox 
              id={option.id} 
              checked={skills.includes(option.label)} 
              onCheckedChange={(checked) => handleCheckboxChange(option.label, !!checked)}
            />
            <Label htmlFor={option.id}>{option.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
