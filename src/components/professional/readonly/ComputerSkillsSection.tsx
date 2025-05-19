
import { Computer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComputerSkillsSectionProps {
  skillLevel: string;
}

const ComputerSkillsSection = ({ skillLevel }: ComputerSkillsSectionProps) => {
  // Format computer skill level for display
  const formatSkillLevel = (skillLevel: string) => {
    switch(skillLevel) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      case 'expert': return 'Expert';
      default: return 'Not specified';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Computer className="h-5 w-5" />
          Computer Skills Level
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{skillLevel ? formatSkillLevel(skillLevel) : 'Not specified'}</p>
      </CardContent>
    </Card>
  );
};

export default ComputerSkillsSection;
