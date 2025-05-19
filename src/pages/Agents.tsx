
import React, { useState, useEffect } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { useUsersData } from '@/hooks/useUsersData';
import UsersList from '@/components/agents/UsersList';
import { Container } from '@/components/ui/container';
import AuthAlert from '@/components/agents/AuthAlert';
import AgentFilters from '@/components/agents/AgentFilters';
import AgentDetailsDialog from '@/components/agents/AgentDetailsDialog';
import { Button } from '@/components/ui/button';
import { FilterIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import AgentsList from '@/components/agents/AgentsList';
import { useNavigate } from 'react-router-dom';

const Agents = () => {
  const { user, userRole } = useUserContext();
  const { users, loading, error, expandedUser, playingAudio, fetchAllUsers, toggleUserExpand, handleAudioPlay, toggleAvailability } = useUsersData(user);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Team state: store IDs of users added to team
  const [team, setTeam] = useState<string[]>([]);

  const toggleTeamMember = (id: string) => {
    setTeam(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };
  
  // Filter users based on current filter
  const filteredUsers = users.filter(user => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'audio') return user.audio_files?.length > 0;
    if (currentFilter === 'available') return user.is_available;
    if (currentFilter === 'favorites') return team.includes(user.id);
    return true;
  });

  // Calculate pagination
  const PAGE_SIZE = 9;
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentPageUsers = filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);
  
  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [currentFilter]);
  
  const viewAgentDetails = (userId: string) => {
    setSelectedAgentId(userId);
  };

  // Create empty props for AgentFilters since we're still using the old component
  const emailFilter = "";
  const setEmailFilter = () => {};
  const dateRange = { from: null, to: null };
  const setDateRange = () => {};
  const resetFilters = () => {};

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Agent Profiles</h1>
            <p className="text-muted-foreground">
              {filteredUsers.length} agents found • {team.length} in team
            </p>
          </div>
          
          <div className="flex gap-2">
            {/* Return to dashboard button */}
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Return to Dashboard
            </Button>
            
            {isMobile && (
              <Button
                variant="outline"
                onClick={() => setFilterMenuOpen(true)}
              >
                <FilterIcon className="h-4 w-4 mr-2" />
                Filters
              </Button>
            )}
          </div>
        </div>
        
        {/* Main content with filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters sidebar - hidden on mobile */}
          {!isMobile && (
            <div className="lg:col-span-1">
              <AgentFilters
                emailFilter={emailFilter}
                setEmailFilter={setEmailFilter}
                dateRange={dateRange}
                setDateRange={setDateRange}
                resetFilters={resetFilters}
              />
            </div>
          )}
          
          {/* Mobile filter drawer */}
          {isMobile && (
            <AgentFilters
              emailFilter={emailFilter}
              setEmailFilter={setEmailFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
              resetFilters={resetFilters}
              isCalendarOpen={filterMenuOpen}
              setIsCalendarOpen={setFilterMenuOpen}
            />
          )}
          
          {/* Agent list */}
          <div className="lg:col-span-3">
            {!user && <AuthAlert />}
            
            <AgentsList
              users={filteredUsers}
              loading={loading}
              error={error}
              userRole={userRole || 'agent'}
              canSeeAudio={!!user && (userRole === 'admin' || userRole === 'business')}
              currentPageUsers={currentPageUsers}
              page={page}
              totalPages={totalPages}
              fetchAllUsers={fetchAllUsers}
              setPage={setPage}
              viewAgentDetails={viewAgentDetails}
              toggleAvailability={toggleAvailability}
              team={team}
              toggleTeamMember={toggleTeamMember}
            />
          </div>
        </div>
      </Container>

      {/* Agent details dialog */}
      {selectedAgentId && (
        <AgentDetailsDialog
          selectedAgentId={selectedAgentId}
          onClose={() => setSelectedAgentId(null)}
        />
      )}
    </div>
  );
};

export default Agents;
