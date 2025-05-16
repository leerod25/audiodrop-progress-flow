
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from 'lucide-react';
import { useAgentAudio } from '@/hooks/useAgentAudio';
import { Agent } from '@/types/Agent';
import { testAudioStorage } from '@/utils/testAudioStorage';

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
  const { audioList, loading, error } = useAgentAudio(agent.id);
  
  const copyAgentId = () => {
    navigator.clipboard.writeText(agent.id)
      .then(() => console.log('[AgentDetailCard] Agent ID copied'))
      .catch(err => console.error('[AgentDetailCard] Copy failed:', err));
  };
  
  const runStorageTest = () => {
    if (agent.id) {
      console.log('[AgentDetailCard] Running storage test for agent:', agent.id);
      testAudioStorage(agent.id);
    }
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
        
        {/* Audio recordings list */}
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">All Recordings</h3>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runStorageTest}
            className="mb-4"
          >
            Run Storage Test (Check Console)
          </Button>
          
          {loading ? (
            <p className="text-sm text-gray-500">Loading recordings...</p>
          ) : error ? (
            <p className="text-sm text-red-500">Error loading recordings: {error}</p>
          ) : audioList.length > 0 ? (
            <div className="space-y-4">
              {audioList.map(({ id, title, url, created_at }) => (
                <div key={id} className="p-3 border rounded-lg">
                  <div className="flex flex-col space-y-2">
                    <div>
                      <span className="font-medium">{title}</span><br />
                      <small className="text-gray-500">{created_at ? new Date(created_at).toLocaleString() : ''}</small>
                    </div>
                    
                    {/* Simple audio player without source tag */}
                    <div className="w-full">
                      <p className="text-xs text-gray-500 mb-1">Audio URL: {url}</p>
                      <audio 
                        controls 
                        preload="none" 
                        className="w-full"
                        src={url}
                      >
                        Your browser does not support audio playback.
                      </audio>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No recordings available</p>
          )}
        </div>
        
        {/* Debug UI: display raw audio data and full agent ID for copy-pasting */}
        <div className="my-4 p-3 bg-gray-100 rounded-md">
          <h3 className="text-lg font-medium">Debug: Audio Data</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto whitespace-pre-wrap break-words text-xs">
            {JSON.stringify({ audioList, loading, error }, null, 2)}
          </pre>
          <h3 className="text-lg font-medium mt-4">Debug: Full Agent ID</h3>
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
