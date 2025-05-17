
import React, { useState, useEffect } from 'react';
import { useUserContext } from "@/contexts/UserContext";
import { Agent } from '@/types/Agent';
import { useAgents } from '@/hooks/useAgents';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

// Extracted components
import AgentFilterContainer from '@/components/agent/AgentFilterContainer';
import AgentList from '@/components/agent/AgentList';
import AgentDetailView from '@/components/agent/AgentDetailView';
import AgentAudioModal from '@/components/agent/AgentAudioModal';

const AgentPreview: React.FC = () => {
  const { userRole } = useUserContext();
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [showAgentCard, setShowAgentCard] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  
  // Custom hooks for data and audio
  const { 
    agents, 
    loading, 
    countries, 
    cities, 
    skillLevels,
    toggleFavorite 
  } = useAgents();

  const {
    currentAudio,
    isPlaying,
    toggleAudio,
    stopAudio
  } = useAudioPlayer();

  // Initialize filteredAgents with all agents when the agents array changes
  useEffect(() => {
    if (agents.length > 0) {
      setFilteredAgents(agents);
    }
  }, [agents]);

  // Check if user is business role
  const isBusinessAccount = userRole === 'business';

  // Show agent details card with audio recordings
  const showAgentDetails = (agent: Agent) => {
    console.log("showAgentDetails called with agent:", agent.id);
    setSelectedAgent(agent);
    setShowAgentCard(true);
    
    // Scroll to the top to ensure the detail card is visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open audio player modal
  const openAudioModal = (agent: Agent) => {
    if (!agent.audio_url) {
      return;
    }

    setCurrentAgent(agent);
    setShowAudioModal(true);
    
    // Auto-play in modal
    if (agent.audio_url) {
      toggleAudio(agent.audio_url);
    }
  };

  // Format the user ID to show only first 8 characters
  const formatUserId = (id: string) => `${id.substring(0, 8)}...`;

  // Reset all filters
  const resetFilters = () => {
    setFilteredAgents(agents);
  };

  // Close audio modal
  const closeAudioModal = () => {
    stopAudio();
    setShowAudioModal(false);
    setCurrentAgent(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agent Preview</h1>
      </div>
      
      <AgentFilterContainer
        agents={agents}
        countries={countries}
        cities={cities}
        skillLevels={skillLevels}
        onApplyFilters={setFilteredAgents}
        isBusinessAccount={isBusinessAccount}
      />
      
      {/* Show Agent Detail Card if Selected */}
      {showAgentCard && selectedAgent && (
        <AgentDetailView
          agent={selectedAgent}
          isBusinessAccount={isBusinessAccount}
          toggleFavorite={toggleFavorite}
          onClose={() => {
            console.log("Close Details clicked");
            setShowAgentCard(false);
          }}
        />
      )}
      
      <AgentList
        agents={filteredAgents}
        loading={loading}
        isBusinessAccount={isBusinessAccount}
        currentAudio={currentAudio}
        isPlaying={isPlaying}
        toggleFavorite={toggleFavorite}
        showAgentDetails={showAgentDetails}
        openAudioModal={openAudioModal}
        resetFilters={resetFilters}
      />

      {/* Audio Player Modal */}
      <AgentAudioModal
        isOpen={showAudioModal}
        onOpenChange={setShowAudioModal}
        currentAgent={currentAgent}
        isPlaying={isPlaying}
        toggleAudio={toggleAudio}
        closeAudioModal={closeAudioModal}
        toggleFavorite={toggleFavorite}
        isBusinessAccount={isBusinessAccount}
        formatUserId={formatUserId}
        showAgentDetails={showAgentDetails}
      />
    </div>
  );
};

export default AgentPreview;
