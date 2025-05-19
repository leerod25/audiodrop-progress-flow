
import React, { useState, useEffect } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { useUsersData } from '@/hooks/useUsersData';
import { Container } from '@/components/ui/container';
import AuthAlert from '@/components/agents/AuthAlert';
import AgentFilters from '@/components/agents/AgentFilters';
import AgentDetailsDialog from '@/components/agents/AgentDetailsDialog';
import { Button } from '@/components/ui/button';
import { FilterIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import AgentsList from '@/components/agents/AgentsList';
import { useNavigate } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { User } from '@/hooks/users/useUserFetch';

// Sample agent data for demo purposes (updated to North America and added one more profile)
const sampleAgents: User[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'agent1@example.com',
    full_name: 'Alex Smith',
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
    email: 'agent2@example.com',
    full_name: 'Maria Garcia',
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
    email: 'agent3@example.com',
    full_name: 'John Lee',
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
    email: 'agent4@example.com',
    full_name: 'Sofia Hernandez',
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
    email: 'agent5@example.com',
    full_name: 'James Wilson',
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
    email: 'agent6@example.com',
    full_name: 'Carlos Rodriguez',
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
  const [currentFilter, setCurrentFilter] = useState('all');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Team state: store IDs of users added to team
  const [team, setTeam] = useState<string[]>([]);
  
  // Use sample agents if not logged in, or API users if logged in
  const users = user ? apiUsers : sampleAgents;

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
          
          <div className="flex gap-2">
            {/* Return to home button */}
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Return to Home
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
        
        {/* Authentication alert */}
        {!user && <AuthAlert />}
        
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
