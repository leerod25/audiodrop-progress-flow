
import React, { useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Agent } from '@/types/Agent';
import { Play, Pause, Stop } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';

interface AgentListCardProps {
  agent: Agent;
  onViewDetails: (agent: Agent) => void;
  onAddToTeam: (agent: Agent) => void;
  onPlaySample?: (agent: Agent) => void;
}

const AgentListCard: React.FC<AgentListCardProps> = ({
  agent,
  onViewDetails,
  onAddToTeam,
  onPlaySample,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Pick the very first URL from audioUrls
  const sampleUrl = agent.audioUrls && agent.audioUrls[0]?.url;

  const handlePlayPause = () => {
    if (!sampleUrl || !audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Audio playback error:", err);
        });
    }
  };
  
  const handleStop = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };
  
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>Agent ID: {agent.id.substring(0, 8)}…</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          {agent.city && `${agent.city}, `}
          {agent.country}
        </p>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(agent)}
          >
            Details
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddToTeam(agent)}
          >
            Add to Team
          </Button>

          {sampleUrl && (
            <>
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 border-green-500 text-white"
                onClick={onPlaySample ? () => onPlaySample(agent) : handlePlayPause}
              >
                {isPlaying ? (
                  <>
                    <Pause className="mr-1 h-4 w-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-1 h-4 w-4" /> Play Sample
                  </>
                )}
              </Button>
              
              {isPlaying && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleStop}
                >
                  <Stop className="mr-1 h-4 w-4" /> Stop
                </Button>
              )}
              
              <audio
                ref={audioRef}
                src={sampleUrl}
                preload="none"
                className="hidden"
                onEnded={() => setIsPlaying(false)}
              />
            </>
          )}
        </div>
        
        {isPlaying && sampleUrl && (
          <div className="mt-3">
            <AudioPlayer audioUrl={sampleUrl} suppressErrors={true} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentListCard;
