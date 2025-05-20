
import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDate } from '@/utils/dateUtils';
import { Agent } from '@/types/Agent';

interface AgentDetailsHeaderProps {
  agent: Agent;
  isPriorityAgent?: boolean;
}

const AgentDetailsHeader: React.FC<AgentDetailsHeaderProps> = ({ agent, isPriorityAgent = false }) => {
  return (
    <div className={`p-4 rounded-lg ${isPriorityAgent ? 'bg-blue-50 border border-blue-200' : 'bg-muted/30'}`}>
      <div className="flex items-center gap-4">
        <Avatar className={`h-16 w-16 border ${isPriorityAgent ? 'border-blue-500' : ''}`}>
          <AvatarFallback className={isPriorityAgent ? 'bg-blue-100 text-blue-700' : ''}>
            {isPriorityAgent ? 'MS' : agent.id.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`text-xl font-medium ${isPriorityAgent ? 'text-blue-700' : ''}`}>
              {isPriorityAgent ? "Mission Statement" : `Agent ID: ${agent.id.substring(0, 8)}...`}
            </h3>
            {agent.is_available !== undefined && (
              <Badge variant={agent.is_available ? "default" : "destructive"}>
                {agent.is_available ? 'Available' : 'On Project'}
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
            {agent.country && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{[agent.city, agent.country].filter(Boolean).join(", ")}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>Joined {formatDate(agent.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailsHeader;
