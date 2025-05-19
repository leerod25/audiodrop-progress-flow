
import React, { useState, useEffect } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { useUsersData } from '@/hooks/useUsersData';
import { Container } from '@/components/ui/container';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { User } from '@/hooks/users/useUserFetch';
import { Agent } from '@/types/Agent';
import { convertUserToAgent } from '@/utils/agentUtils';
import { sampleAgents } from '@/data/sampleAgents';
import AgentsHeroBanner from '@/components/agents/AgentsHeroBanner';
import AgentFilterBar from '@/components/agents/AgentFilterBar';
import AuthAlert from '@/components/agents/AuthAlert';
import AgentDetailsDialog from '@/components/agents/AgentDetailsDialog';
import AgentsGrid from '@/components/agents/AgentsGrid';
import AgentListPagination from '@/components/agents/AgentListPagination';
import { useAgentsPage } from '@/hooks/agents/useAgentsPage';

const Agents = () => {
  const { user } = useUserContext();
  const { users: apiUsers, loading, error, expandedUser, playingAudio, fetchAllUsers } = useUsersData(user);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  
  // Use our new hook for most of the page logic
  const {
    processedUsers,
    currentPageUsers,
    filteredUsers,
    playingAgent,
    team,
    page,
    totalPages,
    filters,
    countries,
    cities,
    handleFilterChange,
    handlePlaySample,
    toggleTeamMember,
    setPage
  } = useAgentsPage({ 
    apiUsers: apiUsers as User[], // Add type assertion here
    user, 
    sampleAgents 
  });
  
  const viewAgentDetails = (userId: string) => {
    setSelectedAgentId(userId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner */}
      <AgentsHeroBanner isLoggedIn={!!user} />
      
      <Container className="py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Available Agents</h2>
            <p className="text-muted-foreground">
              {filteredUsers.length} agents found • {team.length} in team
            </p>
          </div>
        </div>
        
        {/* Authentication alert */}
        {!user && <AuthAlert />}
        
        {/* Filter component */}
        <AgentFilterBar 
          countries={countries}
          cities={cities}
          onFilterChange={handleFilterChange}
        />
        
        {/* Agent Grid with audio playback */}
        <AgentsGrid
          loading={loading}
          currentPageUsers={currentPageUsers}
          viewAgentDetails={viewAgentDetails}
          toggleTeamMember={toggleTeamMember}
          convertToAgent={convertUserToAgent}
          handlePlaySample={handlePlaySample}
          playingAgent={playingAgent}
        />
        
        {/* Pagination */}
        <AgentListPagination 
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      </Container>

      {/* Agent details dialog */}
      {selectedAgentId && (
        <AgentDetailsDialog
          selectedAgentId={selectedAgentId}
          onClose={() => setSelectedAgentId(null)}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Agents;
