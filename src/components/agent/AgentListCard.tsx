
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Agent } from '@/types/Agent';
import { Loader2 } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';

interface AgentListCardProps {
  agent: Agent;
  onViewDetails: (agent: Agent) => void;
  onAddToTeam: (agent: Agent) => void;
}

const AgentListCard: React.FC<AgentListCardProps> = ({
  agent,
  onViewDetails,
  onAddToTeam,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pick the very first URL from audioUrls
  const sampleUrl = agent.audioUrls && agent.audioUrls[0]?.url;

  const handlePlayAudio = () => {
    setIsLoading(true);
    setShowPlayer(true);
    setIsLoading(false);
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

        <div className="flex items-center gap-3 flex-wrap">
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
            <Button
              size="sm"
              className="bg-green-500 hover:bg-green-600 border-green-500 text-white"
              onClick={handlePlayAudio}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                '▶︎ Play Sample'
              )}
            </Button>
          )}
        </div>
        
        {showPlayer && sampleUrl && (
          <div className="mt-2">
            <AudioPlayer 
              audioUrl={sampleUrl} 
              suppressErrors={true}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentListCard;
