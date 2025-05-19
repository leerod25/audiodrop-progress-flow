
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export interface ComputerSkillsSectionProps {
  level: string;
}

const ComputerSkillsSection: React.FC<ComputerSkillsSectionProps> = ({ level }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-medium mb-2">Computer Skills</h3>
        <p className="text-sm">{level || 'Not specified'}</p>
      </CardContent>
    </Card>
  );
};

export default ComputerSkillsSection;
