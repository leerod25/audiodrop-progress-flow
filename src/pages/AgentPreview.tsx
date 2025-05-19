
import React, { useState } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { useUsersData } from '@/hooks/useUsersData';
import AgentDetailCard from '@/components/agent/AgentDetailCard';
import AgentDetailsDialog from '@/components/agents/AgentDetailsDialog';
import { Button } from "@/components/ui/button";
import { FileAudio, Info } from 'lucide-react';

const AgentPreview: React.FC = () => {
  const { user, userRole } = useUserContext();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  // Flag to indicate if audio tab should be shown by default
  const [showAudioTab, setShowAudioTab] = useState(false);
  
  // pull *all* non-business users + their audio via your Edge Function
  const {
    users: agents,
    loading,
    error,
  } = useUsersData(user);

  // Handle toggling favorites
  const handleToggleFavorite = (agentId: string, currentStatus: boolean) => {
    console.log('Toggle favorite for agent', agentId, currentStatus);
    // You would implement actual favorite toggling logic here
  }

  // Open agent details dialog with option to show audio tab directly
  const openAgentDetails = (agentId: string, showAudio: boolean = false) => {
    setShowAudioTab(showAudio);
    setSelectedAgentId(agentId);
  };

  if (loading) return <p>Loading agents…</p>;
  if (error)   return <p style={{color:'red'}}>Error: {error}</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">All Agents ({agents.length})</h1>
      {agents.map(a => (
        <div key={a.id} className="mb-8">
          <AgentDetailCard
            agent={{
              ...a,
              has_audio: a.audio_files?.length > 0 || false,
              audioUrls: a.audio_files?.map((file, idx) => ({
                id: file.id || String(idx),
                title: file.title || `Recording ${idx + 1}`,
                url: file.audio_url,
                updated_at: file.created_at || ''
              })) || [],     
              computer_skill_level: a.years_experience?.toString() || null
            }}
            isBusinessAccount={userRole === 'business'}
            formatUserId={(id) => id.substring(0, 8) + '...'}
            toggleFavorite={handleToggleFavorite}
          />
          <div className="flex space-x-2 mt-2">
            <Button 
              variant="default" 
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
              onClick={() => openAgentDetails(a.id, true)}
            >
              <FileAudio className="mr-1" />
              Listen to Audio
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => openAgentDetails(a.id, false)}
            >
              <Info className="mr-1" />
              View Details
            </Button>
          </div>
        </div>
      ))}
      
      {/* Agent Details Dialog with audio tab selection */}
      <AgentDetailsDialog
        selectedAgentId={selectedAgentId}
        onClose={() => setSelectedAgentId(null)}
        defaultTab={showAudioTab ? "recordings" : "professional"}
      />
    </div>
  );
};

export default AgentPreview;
