
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Agent } from '@/types/Agent';
import { useUserContext } from '@/contexts/UserContext';

interface AgentDetailsInfoProps {
  agent: Agent;
}

const AgentDetailsInfo: React.FC<AgentDetailsInfoProps> = ({ agent }) => {
  const { userRole } = useUserContext();
  const isAdmin = userRole === 'admin';

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Professional Details</h3>
        
        <div className="space-y-4">
          {/* Admin-only private details section */}
          {isAdmin && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <h4 className="text-md font-semibold text-red-800 mb-3">Admin Only - Private Details</h4>
              <div className="space-y-2">
                {agent.full_name && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Full Name</p>
                    <p className="text-sm">{agent.full_name}</p>
                  </div>
                )}
                {agent.email && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Email</p>
                    <p className="text-sm">{agent.email}</p>
                  </div>
                )}
                {agent.phone && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Phone</p>
                    <p className="text-sm">{agent.phone}</p>
                  </div>
                )}
                {agent.whatsapp && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">WhatsApp</p>
                    <p className="text-sm">{agent.whatsapp}</p>
                  </div>
                )}
                {agent.bio && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Bio</p>
                    <p className="text-sm">{agent.bio}</p>
                  </div>
                )}
              </div>
            </div>
          )}

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
