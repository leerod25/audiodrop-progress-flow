
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Filter } from 'lucide-react';
import { FilterValues } from '@/components/agents/AgentFilters';

// Import components
import AgentCard from '@/components/agents/AgentCard';
import AgentFilters from '@/components/agents/AgentFilters';
import AgentAudioModal from '@/components/agents/AgentAudioModal';
import AgentLoadingSkeleton from '@/components/agents/AgentLoadingSkeleton';

// Import hooks
import { useAgentData } from '@/hooks/useAgentData';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

const AgentPreview: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);

  // Use custom hooks
  const { 
    filteredAgents, 
    setFilteredAgents,
    loading, 
    countries, 
    cities, 
    skillLevels, 
    agents,
    isBusinessAccount, 
    toggleFavorite 
  } = useAgentData();
  
  const {
    isPlaying,
    showAudioModal,
    currentAgent,
    toggleAudio,
    openAudioModal,
    closeAudioModal,
    setShowAudioModal
  } = useAudioPlayer();

  // Apply filters whenever form values change
  const applyFilters = (values: FilterValues) => {
    let result = [...agents];
    
    if (values.country) {
      result = result.filter(agent => agent.country === values.country);
    }
    
    if (values.city) {
      result = result.filter(agent => agent.city === values.city);
    }
    
    if (values.hasAudio) {
      result = result.filter(agent => agent.has_audio);
    }
    
    if (values.skillLevel) {
      result = result.filter(agent => agent.computer_skill_level === values.skillLevel);
    }
    
    setFilteredAgents(result);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilteredAgents(agents);
    setShowFilters(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agent Preview</h1>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            Filters {showFilters ? '↑' : '↓'}
          </Button>
          
          {showFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
            >
              Reset
            </Button>
          )}
        </div>
      </div>
      
      {showFilters && (
        <AgentFilters
          countries={countries}
          cities={cities}
          skillLevels={skillLevels}
          onFiltersChange={applyFilters}
          resetFilters={resetFilters}
        />
      )}
      
      {loading ? (
        <AgentLoadingSkeleton count={6} />
      ) : filteredAgents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No agents found matching your filters.</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isBusinessAccount={isBusinessAccount}
              toggleFavorite={toggleFavorite}
              openAudioModal={openAudioModal}
            />
          ))}
        </div>
      )}

      {/* Audio Player Modal */}
      <AgentAudioModal
        open={showAudioModal}
        onOpenChange={setShowAudioModal}
        agent={currentAgent}
        isPlaying={isPlaying}
        toggleAudio={toggleAudio}
        toggleFavorite={toggleFavorite}
        isBusinessAccount={isBusinessAccount}
        onCloseAutoFocus={closeAudioModal}
      />
    </div>
  );
};

export default AgentPreview;
