import { useState, useMemo, useEffect } from 'react';
import { User } from '@/hooks/users/useUserFetch';
import { Agent } from '@/types/Agent';

interface UseAgentsPageProps {
  apiUsers: User[];
  user: any;
  sampleAgents: Agent[];
}

interface AgentFilters {
  searchQuery: string;
  country: string;
  city: string;
  availableOnly: boolean;
  experiencedOnly: boolean;
}

export const useAgentsPage = ({ apiUsers, user, sampleAgents }: UseAgentsPageProps) => {
  // Team state: store IDs of users added to team
  const [team, setTeam] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  // Audio playback state
  const [playingAgent, setPlayingAgent] = useState<{
    id: string;
    url: string;
  } | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState<AgentFilters>({
    searchQuery: '',
    country: '',
    city: '',
    availableOnly: false,
    experiencedOnly: false
  });

  // Process users to remove any contact information
  const processedUsers = useMemo(() => {
    if (!apiUsers) return [];
    
    return apiUsers.map(user => ({
      ...user,
      // Keep email since it's required, but could replace with a dummy value if needed
      email: user.email || `agent-${user.id.substring(0, 8)}@example.com`, 
      full_name: `Agent ID: ${user.id.substring(0, 8)}`, // Replace name with agent ID
      // Remove any other potential contact information
      phone: undefined, 
      whatsapp: undefined
    }));
  }, [apiUsers]);
  
  // Use sample agents if not logged in, or processed API users if logged in
  const users = user ? processedUsers : sampleAgents;
  
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
      if (filters.availableOnly) {
        const userIsAvailable = 'is_available' in user ? user.is_available : false;
        if (!userIsAvailable) return false;
      }
      
      // Experience filter (3+ years)
      if (filters.experiencedOnly) {
        const yearsExp = 'years_experience' in user 
          ? parseInt(user.years_experience || '0') 
          : 0;
        if (yearsExp < 3) return false;
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

  // Toggle team membership
  const toggleTeamMember = (id: string) => {
    setTeam(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: AgentFilters) => {
    setFilters(newFilters);
  };

  // Function to get the latest audio URL from an agent
  const getLatestAudioUrl = (agent: Agent): string | undefined => {
    // Try to get from audio_files (from API)
    if (agent.audio_files && agent.audio_files.length > 0) {
      // Find the latest audio file by created_at date
      const audioFiles = [...agent.audio_files].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      return audioFiles[0].audio_url;
    }
    
    // Try to get from audioUrls (from samples)
    if (agent.audioUrls && agent.audioUrls.length > 0) {
      // Find the latest audio url by updated_at date
      const audioUrls = [...agent.audioUrls].sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      return audioUrls[0].url;
    }
    
    // Fallback to audio_url if available
    return agent.audio_url || undefined;
  };

  // Enhanced function to handle playing audio samples
  const handlePlaySample = (agent: Agent) => {
    // If this agent is already playing, stop it
    if (playingAgent?.id === agent.id) {
      setPlayingAgent(null);
      return;
    }
    
    // Get the latest audio URL for this agent
    const audioUrl = getLatestAudioUrl(agent);
    
    if (audioUrl) {
      console.log(`Playing audio for agent ${agent.id} from ${audioUrl}`);
      setPlayingAgent({ id: agent.id, url: audioUrl });
    } else {
      console.error(`No audio found for agent ${agent.id}`);
    }
  };

  return {
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
  };
};
