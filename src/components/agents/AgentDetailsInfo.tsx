
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Agent } from '@/types/Agent';

interface AgentDetailsInfoProps {
  agent: Agent;
}

const AgentDetailsInfo: React.FC<AgentDetailsInfoProps> = ({ agent }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Professional Details</h3>
        
        <div className="space-y-4">
          {agent.computer_skill_level && (
            <div>
              <p className="text-sm font-semibold text-gray-700">Computer Skills</p>
              <p>{agent.computer_skill_level}</p>
            </div>
          )}
          
          {agent.years_experience && (
            <div>
              <p className="text-sm font-semibold text-gray-700">Years of Experience</p>
              <p>{agent.years_experience} years</p>
            </div>
          )}
          
          {agent.languages && agent.languages.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700">Languages</p>
              <div className="flex flex-wrap gap-2">
                {agent.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentDetailsInfo;
