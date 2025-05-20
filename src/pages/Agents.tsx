
import React, { useState, useEffect, useMemo } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { useUsersData } from '@/hooks/useUsersData';
import { Container } from '@/components/ui/container';
import AuthAlert from '@/components/agents/AuthAlert';
import AgentDetailsDialog from '@/components/agents/AgentDetailsDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import AgentFilterBar from '@/components/agents/AgentFilterBar';
import AgentsHeroBanner from '@/components/agents/AgentsHeroBanner';
import AgentsGrid from '@/components/agents/AgentsGrid';
import AgentListPagination from '@/components/agents/AgentListPagination';
import { convertUserToAgent } from '@/utils/agentUtils';
import { sampleAgents } from '@/data/sampleAgents';
import { User } from '@/hooks/users/useUserFetch';

const Agents = () => {
  const { user, userRole } = useUserContext();
  const { users: apiUsers, loading, error, expandedUser, playingAudio, fetchAllUsers, toggleUserExpand, handleAudioPlay, toggleAvailability } = useUsersData(user);
  const [page, setPage] = useState(1);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Team state: store IDs of users added to team
  const [team, setTeam] = useState<string[]>([]);
  
  // Process users to remove any contact information and replace full_name with agent ID
  const processedApiUsers = useMemo(() => {
    if (!apiUsers) return [];
    
    return apiUsers.map(user => ({
      ...user,
      email: '', // Remove email
      full_name: `Agent ID: ${user.id.substring(0, 8)}`, // Replace name with agent ID
      // Remove any other potential contact information
      phone: undefined, 
      whatsapp: undefined
    }));
  }, [apiUsers]);
  
  // Use sample agents if not logged in, or processed API users if logged in
  const users = user ? processedApiUsers : sampleAgents;
  
  // Filter states
  const [filters, setFilters] = useState({
    searchQuery: '',
    country: '',
    city: '',
    availableOnly: false,
    experiencedOnly: false
  });

  const toggleTeamMember = (id: string) => {
    setTeam(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };
  
  // Get unique countries and cities from the data
  const countries = useMemo(() => {
    return Array.from(new Set(users.map(user => user.country).filter(Boolean) as string[])).sort();
  }, [users]);

  const cities = useMemo(() => {
    // If country filter is applied, only show cities from that country
    const filteredUsers = filters.country 
      ? users.filter(user => user.country === filters.country)
      : users;
      
    return Array.from(new Set(filteredUsers.map(user => user.city).filter(Boolean) as string[])).sort();
  }, [users, filters.country]);
  
  // Filter users based on filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Text search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const idMatch = user.id?.toLowerCase().includes(query) || false;
        const locationMatch = 
          (user.country?.toLowerCase().includes(query) || false) || 
          (user.city?.toLowerCase().includes(query) || false);
          
        if (!idMatch && !locationMatch) return false;
      }
      
      // Country filter
      if (filters.country && user.country !== filters.country) {
        return false;
      }
      
      // City filter
      if (filters.city && user.city !== filters.city) {
        return false;
      }
      
      // Availability filter
      if (filters.availableOnly && !user.is_available) {
        return false;
      }
      
      // Experience filter (3+ years)
      if (filters.experiencedOnly) {
        const years = parseInt(user.years_experience || '0');
        if (years < 3) return false;
      }
      
      return true;
    });
  }, [users, filters]);

  // Sort users: priority agent (3a067ecc) first, then the rest
  const sortedUsers = useMemo(() => {
    // Clone the array to avoid mutating the original
    const sorted = [...filteredUsers];
    
    // Sort function: move priority agent to the top
    return sorted.sort((a, b) => {
      if (a.id.includes('3a067ecc')) return -1;
      if (b.id.includes('3a067ecc')) return 1;
      return 0;
    });
  }, [filteredUsers]);
  
  // Calculate pagination
  const PAGE_SIZE = 9;
  const totalPages = Math.ceil(sortedUsers.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentPageUsers = sortedUsers.slice(startIndex, startIndex + PAGE_SIZE);
  
  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [filters]);
  
  const viewAgentDetails = (userId: string) => {
    setSelectedAgentId(userId);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
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
        
        {/* Agent Grid */}
        <AgentsGrid 
          loading={loading}
          currentPageUsers={currentPageUsers}
          viewAgentDetails={viewAgentDetails}
          toggleTeamMember={toggleTeamMember}
          convertToAgent={convertUserToAgent}
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
