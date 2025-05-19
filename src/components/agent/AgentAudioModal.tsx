
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Agent } from '@/types/Agent';
import AudioPlayer from '@/components/AudioPlayer';

interface AgentAudioModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentAgent: Agent | null;
  isPlaying: boolean;
  toggleAudio: (audioUrl: string) => void;
  stopAudio: () => void;
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
  stopAudio,
  closeAudioModal,
  toggleFavorite,
  isBusinessAccount,
  formatUserId,
  showAgentDetails,
}) => {
  if (!currentAgent) return null;
  
  const audioUrl = currentAgent.audio_url || 
                  (currentAgent.audioUrls && currentAgent.audioUrls.length > 0 ? 
                   currentAgent.audioUrls[0].url : 
                   null);

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
            
            {audioUrl ? (
              <>
                <div className="flex justify-center mb-4 space-x-2">
                  <Button
                    onClick={() => toggleAudio(audioUrl)}
                    className="bg-green-500 hover:bg-green-600 text-white"
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
                  
                  <Button
                    variant="outline"
                    onClick={stopAudio}
                    disabled={!isPlaying}
                  >
                    <Square className="mr-2 h-4 w-4" />
                    Stop
                  </Button>
                </div>
                
                {isPlaying && (
                  <div className="mt-2">
                    <AudioPlayer audioUrl={audioUrl} suppressErrors={true} />
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-gray-500">No audio sample available</p>
            )}
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
