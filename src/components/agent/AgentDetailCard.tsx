
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';
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
  console.log('AgentDetailCard rendering with agent:', agent);
  console.log('Agent ID type:', typeof agent.id, 'Value:', agent.id);
  
  const { audioList, loading, error } = useAgentAudio(agent.id);
  
  console.log('Audio list:', audioList);
  console.log('Audio loading:', loading);
  console.log('Audio error:', error);
  
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
        
        {/* Debug: Raw Audio Data Display */}
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <h3 className="text-sm font-semibold mb-2">Debug: Audio Data</h3>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify({audioList, loading, error}, null, 2)}
          </pre>
        </div>
        
        {/* Audio recordings list */}
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">All Recordings</h3>
          
          {loading ? (
            <p className="text-sm text-gray-500">Loading recordings...</p>
          ) : error ? (
            <p className="text-sm text-red-500">Error loading recordings: {error}</p>
          ) : audioList.length > 0 ? (
            <div className="space-y-4">
              {audioList.map(rec => (
                <div key={rec.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{rec.title}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(rec.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <AudioPlayer
                    audioUrl={rec.url}
                    requiresPermission={false}
                    suppressErrors={false}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No recordings available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentDetailCard;
