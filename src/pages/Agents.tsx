
import React, { useState, useEffect, useMemo } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { useUsersData } from '@/hooks/useUsersData';
import { useAgentAverageRatings } from '@/hooks/useAgentAverageRatings';
import { useInviteToken } from '@/hooks/useInviteToken';
import { Container } from '@/components/ui/container';
import AuthAlert from '@/components/agents/AuthAlert';
import AgentDetailsDialog from '@/components/agents/AgentDetailsDialog';
import InviteAccessBanner from '@/components/agents/InviteAccessBanner';
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
  const { averageRatings, getSortedAgentIds } = useAgentAverageRatings();
  const [page, setPage] = useState(1);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Get invite token from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const inviteToken = urlParams.get('invite_token');
  const { inviteData, isLoading: tokenLoading, isValid: tokenIsValid } = useInviteToken(inviteToken);

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
      whatsapp: undefined,
      // Add average rating to user data
      average_rating: averageRatings[user.id] || null
    }));
  }, [apiUsers, averageRatings]);
  
  // Determine if user has access (logged in OR valid invite token)
  const hasAccess = user || tokenIsValid;
  
  // Use sample agents if no access, or processed API users if access is granted
  const users = hasAccess ? processedApiUsers : sampleAgents;
  
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

  // Sort users by star ratings (highest to lowest), then by priority agent
  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers];
    
    return sorted.sort((a, b) => {
      // First priority: highest rated agents
      const ratingA = averageRatings[a.id] || 0;
      const ratingB = averageRatings[b.id] || 0;
      
      if (ratingA !== ratingB) {
        return ratingB - ratingA; // Highest rating first
      }
      
      // Second priority: priority agent (3a067ecc) 
      if (a.id.includes('3a067ecc')) return -1;
      if (b.id.includes('3a067ecc')) return 1;
      
      // Third priority: agents with audio samples
      const hasAudioA = (a.audio_files && a.audio_files.length > 0) ? 1 : 0;
      const hasAudioB = (b.audio_files && b.audio_files.length > 0) ? 1 : 0;
      
      return hasAudioB - hasAudioA;
    });
  }, [filteredUsers, averageRatings]);
  
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
        {/* Show invite access banner if accessing via valid invite token */}
        {tokenIsValid && inviteData && (
          <InviteAccessBanner 
            email={inviteData.email} 
            expiresAt={inviteData.expires_at} 
          />
        )}
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Available Agents</h2>
            <p className="text-muted-foreground">
              {filteredUsers.length} agents found • {team.length} in team
              {Object.keys(averageRatings).length > 0 && " • Sorted by ratings (highest first)"}
              {tokenIsValid && " • Guest access active"}
            </p>
          </div>
        </div>
        
        {/* Authentication alert - only show if no access */}
        {!hasAccess && <AuthAlert />}
        
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
