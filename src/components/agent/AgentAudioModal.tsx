
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Agent } from '@/types/Agent';

interface AgentAudioModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentAgent: Agent | null;
  isPlaying: boolean;
  toggleAudio: (audioUrl: string) => void;
  closeAudioModal: () => void;
  toggleFavorite: (agentId: string, currentStatus: boolean) => void;
  isBusinessAccount: boolean;
  formatUserId: (id: string) => string;
  showAgentDetails: (agent: Agent) => void;
}

const AgentAudioModal: React.FC<AgentAudioModalProps> = ({
  isOpen,
  onOpenChange,
  currentAgent,
  isPlaying,
  toggleAudio,
  closeAudioModal,
  toggleFavorite,
  isBusinessAccount,
  formatUserId,
  showAgentDetails,
}) => {
  if (!currentAgent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent onCloseAutoFocus={closeAudioModal} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agent Audio Sample</DialogTitle>
          <DialogDescription>
            Listen to this agent's audio sample
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full rounded-md bg-gray-100 p-4">
            <div className="mb-2 text-sm text-gray-500">Agent ID: {formatUserId(currentAgent.id)}</div>
            <div className="mb-4 text-sm text-gray-500">
              {currentAgent.country} {currentAgent.city ? `· ${currentAgent.city}` : ''}
            </div>
            
            <div className="flex justify-center">
              <Button
                onClick={() => currentAgent.audio_url && toggleAudio(currentAgent.audio_url)}
                className="mx-auto"
              >
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Play
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {isBusinessAccount && !currentAgent.is_favorite && (
            <Button 
              onClick={() => toggleFavorite(currentAgent.id, !!currentAgent.is_favorite)}
              variant="outline"
            >
              <Star className="mr-2 h-4 w-4" />
              Add to Team
            </Button>
          )}
          
          {isBusinessAccount && currentAgent.is_favorite && (
            <Button 
              onClick={() => toggleFavorite(currentAgent.id, !!currentAgent.is_favorite)}
              variant="default"
            >
              <Star className="mr-2 h-4 w-4 fill-white" />
              Remove from Team
            </Button>
          )}
          
          <Button
            variant="outline" 
            onClick={() => {
              closeAudioModal();
              showAgentDetails(currentAgent);
            }}
          >
            View All Recordings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentAudioModal;
