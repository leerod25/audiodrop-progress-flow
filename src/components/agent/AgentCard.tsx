
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, FileAudio, CheckCircle, XCircle, Star, Play, Pause } from 'lucide-react';
import { Agent } from '@/types/Agent';

interface AgentCardProps {
  agent: Agent;
  isBusinessAccount: boolean;
  isPlaying: boolean;
  currentAudio: string | null;
  toggleFavorite: (agentId: string, currentStatus: boolean) => void;
  showAgentDetails: (agent: Agent) => void;
  openAudioModal: (agent: Agent) => void;
  formatUserId: (id: string) => string;
}

const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  isBusinessAccount,
  isPlaying,
  currentAudio,
  toggleFavorite,
  showAgentDetails,
  openAudioModal,
  formatUserId,
}) => {
  // Function to handle the "View All Recordings" button click
  const handleViewAllRecordings = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click from firing
    console.log("View All Recordings clicked for agent:", agent.id);
    showAgentDetails(agent);
  };

  // Determine if this agent's audio is currently playing
  const isThisAgentPlaying = isPlaying && agent.id === currentAudio;
  
  return (
    <Card 
      className="shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        console.log("Card clicked, showing agent details:", agent.id);
        showAgentDetails(agent);
      }}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4 mt-2">
          <div className="flex items-center">
            <User className="mr-2 text-gray-500" size={18} />
            <span className="font-semibold text-gray-700">{formatUserId(agent.id)}</span>
            
            {/* Display play icon if agent has audio */}
            {agent.has_audio && (
              <Play 
                className="ml-2 text-green-500 hover:text-green-600" 
                size={16}
                aria-label="Has audio samples"
              />
            )}
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
        
        <div className="flex justify-between mt-4" onClick={(e) => e.stopPropagation()}>
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
          
          <div className="flex space-x-2">
            {agent.has_audio && (
              <Button 
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  openAudioModal(agent);
                }}
              >
                {isThisAgentPlaying ? (
                  <Pause className="mr-1 h-4 w-4" />
                ) : (
                  <Play className="mr-1 h-4 w-4" />
                )}
                {isThisAgentPlaying ? 'Pause' : 'Play Sample'}
              </Button>
            )}
            
            <Button 
              variant="outline"
              size="sm"
              onClick={handleViewAllRecordings}
              className="text-sm font-medium"
            >
              View All Recordings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCard;
