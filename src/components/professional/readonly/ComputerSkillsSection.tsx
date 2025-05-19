
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComputerSkillsSectionProps {
  computerSkillLevel: string;
}

const ComputerSkillsSection: React.FC<ComputerSkillsSectionProps> = ({ 
  computerSkillLevel 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Computer Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="capitalize">{computerSkillLevel || 'Not specified'}</p>
      </CardContent>
    </Card>
  );
};

export default ComputerSkillsSection;
