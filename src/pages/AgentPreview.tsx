
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
import AgentDetailCard from '@/components/agent/AgentDetailCard';

const AgentPreview: React.FC = () => {
  const { userRole } = useUserContext();
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [showAgentCard, setShowAgentCard] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  
  // Custom hooks for data and audio
  const { 
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
    // This will be handled by the AgentFilterContainer component
  };

  // Close audio modal
  const closeAudioModal = () => {
    stopAudio();
    setShowAudioModal(false);
    setCurrentAgent(null);
  };

  // Toggle between list and details view
  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'details' : 'list');
    if (showAgentCard) {
      setShowAgentCard(false);
      setSelectedAgent(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agent Preview</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleViewMode} 
            className={`px-4 py-2 rounded-md ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            List View
          </button>
          <button 
            onClick={toggleViewMode} 
            className={`px-4 py-2 rounded-md ${viewMode === 'details' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Details View
          </button>
        </div>
      </div>
      
      <AgentFilterContainer
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
      
      {/* When in list view and no agent is selected */}
      {viewMode === 'list' && !showAgentCard && (
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
      )}

      {/* When in details view and no agent is explicitly selected */}
      {viewMode === 'details' && !showAgentCard && (
        <div className="space-y-6">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-20 bg-gray-200 rounded w-full"></div>
              <div className="h-20 bg-gray-200 rounded w-full"></div>
              <div className="h-20 bg-gray-200 rounded w-full"></div>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No agents found matching your filters.</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          ) : (
            filteredAgents.map((agent) => (
              <AgentDetailCard
                key={agent.id}
                agent={agent}
                isBusinessAccount={isBusinessAccount}
                formatUserId={formatUserId}
                toggleFavorite={toggleFavorite}
              />
            ))
          )}
        </div>
      )}
      
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
