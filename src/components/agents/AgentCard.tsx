
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileAudio, CheckCircle, XCircle, Star, Volume2, User, ExternalLink } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Agent } from '@/types/agent';

interface AgentCardProps {
  agent: Agent;
  isBusinessAccount: boolean;
  toggleFavorite: (agentId: string, currentStatus: boolean) => void;
  openAudioModal: (agent: Agent) => void;
}

const formatUserId = (id: string) => `${id.substring(0, 8)}...`;

const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  isBusinessAccount,
  toggleFavorite,
  openAudioModal
}) => {
  const handleCardAction = () => {
    // Always open modal, regardless of audio availability
    openAudioModal(agent);
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={handleCardAction}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4 mt-2">
          <div className="flex items-center">
            {agent.avatar_url ? (
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={agent.avatar_url} alt={`Avatar for ${agent.name || agent.id}`} />
                <AvatarFallback>
                  <User className="h-6 w-6 text-gray-400" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <User className="mr-2 text-gray-500" size={18} />
            )}
            <span className="font-semibold text-gray-700">
              {agent.name || formatUserId(agent.id)}
            </span>
          </div>
          
          <div className="flex items-center">
            <FileAudio className="mr-1 text-blue-500" size={18} />
            {agent.has_audio ? (
              <CheckCircle className="text-green-500" size={18} />
            ) : (
              <XCircle className="text-red-500" size={18} />
            )}
          </div>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          <p>{agent.country} {agent.city ? `· ${agent.city}` : ''}</p>
          {agent.computer_skill_level && (
            <p className="mt-1">Skill level: {agent.computer_skill_level}</p>
          )}
        </div>
        
        <div className="flex justify-between mt-4">
          {isBusinessAccount && (
            <Button 
              variant={agent.is_favorite ? "default" : "outline"} 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(agent.id, !!agent.is_favorite);
              }}
              className="text-sm"
            >
              <Star className={`mr-1 h-4 w-4 ${agent.is_favorite ? 'fill-white' : ''}`} />
              {agent.is_favorite ? 'Favorited' : 'Add to Team'}
            </Button>
          )}
          
          {!isBusinessAccount && (
            <Button 
              variant="outline" 
              size="sm"
              disabled={true}
              className="text-sm invisible" // Hidden for non-business users
            >
              View Details
            </Button>
          )}
          
          <Button 
            variant="default"
            size="sm"
            className={`text-sm ${agent.has_audio && agent.audio_url ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleCardAction();
            }}
          >
            {agent.has_audio && agent.audio_url ? (
              <>
                <Volume2 className="mr-1 h-4 w-4" />
                Listen
              </>
            ) : (
              <>
                <ExternalLink className="mr-1 h-4 w-4" />
                View
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCard;
