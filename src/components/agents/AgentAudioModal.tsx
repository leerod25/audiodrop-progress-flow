
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Play, Pause, Star, User, ExternalLink } from 'lucide-react';
import { Agent } from '@/types/agent';

interface AgentAudioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Agent | null;
  isPlaying: boolean;
  toggleAudio: (audioUrl: string) => void;
  toggleFavorite: (agentId: string, currentStatus: boolean) => void;
  isBusinessAccount: boolean;
  onCloseAutoFocus: () => void;
}

const formatUserId = (id: string) => `${id.substring(0, 8)}...`;

const AgentAudioModal: React.FC<AgentAudioModalProps> = ({
  open,
  onOpenChange,
  agent,
  isPlaying,
  toggleAudio,
  toggleFavorite,
  isBusinessAccount,
  onCloseAutoFocus
}) => {
  if (!agent) return null;

  const hasAudio = agent.has_audio && agent.audio_url;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onCloseAutoFocus={onCloseAutoFocus} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{hasAudio ? 'Agent Audio Sample' : 'Agent Profile'}</DialogTitle>
          <DialogDescription>
            {hasAudio 
              ? 'Listen to this agent\'s audio sample'
              : 'View agent profile details'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center mb-4">
            {agent.avatar_url ? (
              <Avatar className="h-20 w-20">
                <AvatarImage src={agent.avatar_url} alt={`Avatar for ${agent.name || agent.id}`} />
                <AvatarFallback>
                  <User className="h-10 w-10 text-gray-400" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <User className="h-16 w-16 text-gray-400" />
            )}
          </div>
          
          <div className="w-full rounded-md bg-gray-100 p-6">
            <div className="mb-2 text-sm text-gray-500">
              Agent: {agent.name || formatUserId(agent.id)}
            </div>
            <div className="mb-4 text-sm text-gray-500">
              {agent.country} {agent.city ? `· ${agent.city}` : ''}
              {agent.computer_skill_level && (
                <p className="mt-1">Skill level: {agent.computer_skill_level}</p>
              )}
            </div>
            
            {agent.description && (
              <div className="mb-4 mt-2 text-sm text-gray-700">
                <p className="font-medium mb-1">About:</p>
                <p>{agent.description}</p>
              </div>
            )}
            
            {hasAudio ? (
              <div className="flex justify-center">
                <Button
                  onClick={() => agent.audio_url && toggleAudio(agent.audio_url)}
                  size="lg"
                  className="mx-auto bg-blue-600 hover:bg-blue-700"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="mr-2 h-5 w-5" />
                      Pause Audio
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Play Audio
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex justify-center">
                <p className="text-gray-500 text-sm italic">
                  No audio sample available for this agent
                </p>
              </div>
            )}
          </div>
          
          {isBusinessAccount && !agent.is_favorite && (
            <Button 
              onClick={() => toggleFavorite(agent.id, !!agent.is_favorite)}
              variant="outline"
              className="w-full"
            >
              <Star className="mr-2 h-4 w-4" />
              Add to Team
            </Button>
          )}
          
          {isBusinessAccount && agent.is_favorite && (
            <Button 
              onClick={() => toggleFavorite(agent.id, !!agent.is_favorite)}
              variant="default"
              className="w-full"
            >
              <Star className="mr-2 h-4 w-4 fill-white" />
              Remove from Team
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentAudioModal;
