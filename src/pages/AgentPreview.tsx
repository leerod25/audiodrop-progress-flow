
import React, { useState } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { useUsersData } from '@/hooks/useUsersData';
import AgentDetailCard from '@/components/agent/AgentDetailCard';
import AgentDetailsDialog from '@/components/agents/AgentDetailsDialog';
import { Button } from "@/components/ui/button"; // Add this import

const AgentPreview: React.FC = () => {
  const { user, userRole } = useUserContext();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  
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

  // Open agent details dialog
  const openAgentDetails = (agentId: string) => {
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
              ...a,                               // include audio_files or audioUrls
              has_audio: a.audio_files?.length > 0 || false, // Add the missing has_audio property
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
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => openAgentDetails(a.id)}
          >
            View Details in Dialog
          </Button>
        </div>
      ))}
      
      {/* Agent Details Dialog */}
      <AgentDetailsDialog
        selectedAgentId={selectedAgentId}
        onClose={() => setSelectedAgentId(null)}
      />
    </div>
  );
};

export default AgentPreview;
