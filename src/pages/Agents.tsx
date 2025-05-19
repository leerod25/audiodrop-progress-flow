import React, { useState, useEffect, useMemo } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { useUsersData } from '@/hooks/useUsersData';
import { Container } from '@/components/ui/container';
import AuthAlert from '@/components/agents/AuthAlert';
import AgentDetailsDialog from '@/components/agents/AgentDetailsDialog';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import AgentsList from '@/components/agents/AgentsList';
import { useNavigate } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { User } from '@/hooks/users/useUserFetch';
import AgentFilterBar from '@/components/agents/AgentFilterBar';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

// Sample agent data for North America (6 profiles) - REMOVED EMAIL fields
const sampleAgents: User[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: '', // Removed email
    full_name: 'Agent ID: 550e8400',
    created_at: '2024-01-15',
    audio_files: [],
    country: 'United States',
    city: 'New York',
    gender: 'Male',
    years_experience: '5',
    languages: ['English', 'Spanish'],
    is_available: true,
    role: 'agent'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: '', // Removed email
    full_name: 'Agent ID: 550e8401',
    created_at: '2024-02-10',
    audio_files: [],
    country: 'Mexico',
    city: 'Mexico City',
    gender: 'Female',
    years_experience: '7',
    languages: ['Spanish', 'English'],
    is_available: true,
    role: 'agent'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: '', // Removed email
    full_name: 'Agent ID: 550e8402',
    created_at: '2024-03-05',
    audio_files: [],
    country: 'Canada',
    city: 'Toronto',
    gender: 'Male',
    years_experience: '3',
    languages: ['English', 'French'],
    is_available: false,
    role: 'agent'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: '', // Removed email
    full_name: 'Agent ID: 550e8403',
    created_at: '2024-01-25',
    audio_files: [],
    country: 'El Salvador',
    city: 'San Salvador',
    gender: 'Female',
    years_experience: '4',
    languages: ['Spanish', 'English'],
    is_available: true,
    role: 'agent'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    email: '', // Removed email
    full_name: 'Agent ID: 550e8404',
    created_at: '2024-02-20',
    audio_files: [],
    country: 'United States',
    city: 'Los Angeles',
    gender: 'Male',
    years_experience: '6',
    languages: ['English'],
    is_available: true,
    role: 'agent'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    email: '', // Removed email
    full_name: 'Agent ID: 550e8405',
    created_at: '2024-03-15',
    audio_files: [],
    country: 'Mexico',
    city: 'Guadalajara',
    gender: 'Male',
    years_experience: '8',
    languages: ['Spanish', 'English', 'Portuguese'],
    is_available: true,
    role: 'agent'
  }
];

const Agents = () => {
  const { user, userRole } = useUserContext();
  const { users: apiUsers, loading, error, expandedUser, playingAudio, fetchAllUsers, toggleUserExpand, handleAudioPlay, toggleAvailability } = useUsersData(user);
  const [page, setPage] = useState(1);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

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

  // Calculate pagination
  const PAGE_SIZE = 9;
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentPageUsers = filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);
  
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
      <section className="w-full relative">
        <AspectRatio ratio={3/1} className="bg-gradient-to-r from-gray-700 to-gray-900">
          <img 
            src="/lovable-uploads/2e644405-88f8-49aa-8ff8-2c0429dc7cb9.png" 
            alt="Headset on laptop keyboard" 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-20 text-white">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
              Agent Profiles
            </h1>
            <p className="mt-4 text-xl lg:text-2xl max-w-2xl">
              Browse our skilled agents and choose the perfect team for your business needs.
            </p>
            <p className="mt-3 text-lg">
              <strong>You're in control</strong> - handpick your team for guaranteed success.
            </p>
            <div className="flex gap-4 mt-6">
              <Button 
                size="lg" 
                variant="default" 
                onClick={() => navigate('/services')}
              >
                Our Services
              </Button>
              {!user && (
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => navigate('/auth')}
                >
                  Login / Sign Up
                </Button>
              )}
            </div>
          </div>
        </AspectRatio>
      </section>
      
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
        
        {/* Agent list */}
        <AgentsList
          users={filteredUsers}
          loading={loading && user !== null} // Only show loading if trying to fetch actual users
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
