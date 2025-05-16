
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from 'lucide-react';
import { useAgentAudio } from '@/hooks/useAgentAudio';
import { Agent } from '@/types/Agent';

interface AgentDetailCardProps {
  agent: Agent;
  isBusinessAccount: boolean;
  formatUserId: (id: string) => string;
  toggleFavorite: (agentId: string, currentStatus: boolean) => void;
}

const AgentDetailCard: React.FC<AgentDetailCardProps> = ({
  agent,
  isBusinessAccount,
  formatUserId,
  toggleFavorite
}) => {
  const { audio, loading, error } = useAgentAudio(agent.id);
  
  const copyAgentId = () => {
    navigator.clipboard.writeText(agent.id)
      .then(() => console.log('[AgentDetailCard] Agent ID copied'))
      .catch(err => console.error('[AgentDetailCard] Copy failed:', err));
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Agent: {formatUserId(agent.id)}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          {agent.country} {agent.city ? `· ${agent.city}` : ''}
          {agent.computer_skill_level && <> · Skill level: {agent.computer_skill_level}</>}
        </p>
        
        {isBusinessAccount && (
          <Button 
            variant={agent.is_favorite ? "default" : "outline"} 
            size="sm"
            onClick={() => toggleFavorite(agent.id, !!agent.is_favorite)}
            className="mb-4"
          >
            <Star className={`mr-1 h-4 w-4 ${agent.is_favorite ? 'fill-white' : ''}`} />
            {agent.is_favorite ? 'Remove from Team' : 'Add to Team'}
          </Button>
        )}
        
        {/* Audio recording display */}
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Audio Recording</h3>
          
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded"
              >
                Retry
              </button>
            </div>
          ) : !audio ? (
            <div className="text-center text-gray-500 py-8">
              <p>No recording available.</p>
            </div>
          ) : (
            <div className="p-3 border rounded-lg">
              <div className="flex flex-col space-y-2">
                <div>
                  <span className="font-medium">{audio.title}</span><br />
                  <small className="text-gray-500">{audio.updated_at ? new Date(audio.updated_at).toLocaleString() : ''}</small>
                </div>
                
                <div className="w-full">
                  <audio 
                    controls 
                    preload="none" 
                    className="w-full"
                    src={audio.url}
                  >
                    Your browser does not support audio playback.
                  </audio>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Debug UI: display raw audio data and full agent ID for copy-pasting */}
        <div className="my-4 p-3 bg-gray-100 rounded-md">
          <h3 className="text-lg font-medium">Debug: Full Agent ID</h3>
          <div className="flex items-center space-x-2">
            <pre className="bg-gray-200 p-2 rounded whitespace-pre-wrap break-all text-xs flex-1">
              {agent.id}
            </pre>
            <Button
              variant="outline"
              size="sm"
              onClick={copyAgentId}
              className="whitespace-nowrap"
            >
              Copy ID
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentDetailCard;
