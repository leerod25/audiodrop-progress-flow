
import React, { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Agent } from '@/types/Agent';

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
  const audioRef = useRef<HTMLAudioElement>(null);
  // Pick the very first URL from audioUrls
  const sampleUrl = agent.audioUrls && agent.audioUrls[0]?.url;

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
                onClick={() => {
                  audioRef.current?.play();
                }}
              >
                ▶︎ Play Sample
              </Button>
              <audio
                ref={audioRef}
                src={sampleUrl}
                preload="none"
                className="hidden"
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentListCard;
