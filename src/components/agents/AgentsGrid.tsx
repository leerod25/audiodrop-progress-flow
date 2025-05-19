
import React, { useState } from 'react';
import { User } from '@/hooks/users/useUserFetch';
import { Agent } from '@/types/Agent';
import AgentListCard from '@/components/agent/AgentListCard';
import { useUserContext } from '@/contexts/UserContext';
import LoginStatusBadge from '@/components/LoginStatusBadge';
import AudioPlayer from '@/components/AudioPlayer';

interface AgentsGridProps {
  loading: boolean;
  currentPageUsers: User[];
  viewAgentDetails: (userId: string) => void;
  toggleTeamMember: (id: string) => void;
  convertToAgent: (user: User) => Agent;
  handlePlaySample?: (agent: Agent) => void;
  playingAgent?: {id: string; url: string} | null;
}

const AgentsGrid: React.FC<AgentsGridProps> = ({
  loading,
  currentPageUsers,
  viewAgentDetails,
  toggleTeamMember,
  convertToAgent,
  handlePlaySample,
  playingAgent
}) => {
  const { userRole } = useUserContext();
  const [audioError, setAudioError] = useState<string | null>(null);

  const handleAudioError = (error: string) => {
    setAudioError(error);
    console.error("Audio playback error:", error);
  };
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-48 bg-gray-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <>
      {userRole === 'admin' && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-purple-800">Admin View</h3>
            <LoginStatusBadge />
          </div>
          <p className="text-sm text-purple-700 mt-1">
            You have admin privileges. You can see full agent details and download audio recordings.
          </p>
        </div>
      )}
    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {currentPageUsers.map((user) => {
          const agent = convertToAgent(user);
          return (
            <div key={user.id} className="space-y-2">
              <AgentListCard 
                key={user.id}
                agent={agent}
                onViewDetails={() => viewAgentDetails(user.id)}
                onAddToTeam={() => toggleTeamMember(user.id)}
                onPlaySample={() => handlePlaySample && handlePlaySample(agent)}
              />
              
              {/* Audio player for currently playing agent */}
              {playingAgent && playingAgent.id === agent.id && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  {audioError ? (
                    <div className="p-2 bg-red-50 text-red-600 rounded text-sm">
                      {audioError}
                      <button 
                        className="ml-2 text-red-700 underline" 
                        onClick={() => setAudioError(null)}
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <AudioPlayer 
                      audioUrl={playingAgent.url} 
                      autoPlay={true}
                      onError={handleAudioError}
                      className="w-full"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AgentsGrid;
