
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useUserContext } from "@/contexts/UserContext";
import { useForm } from "react-hook-form";
import { Agent } from '@/types/Agent';

// Extracted components
import LoadingAgentCards from '@/components/agent/LoadingAgentCards';
import AgentFilters, { FilterValues } from '@/components/agent/AgentFilters';
import AgentCard from '@/components/agent/AgentCard';
import AgentDetailCard from '@/components/agent/AgentDetailCard';
import AgentAudioModal from '@/components/agent/AgentAudioModal';

const AgentPreview: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [skillLevels, setSkillLevels] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [showAgentCard, setShowAgentCard] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const { user, userRole } = useUserContext();

  const form = useForm<FilterValues>({
    defaultValues: {
      country: '',
      city: '',
      hasAudio: false,
      skillLevel: '',
    },
  });

  // Check if user is business role
  const isBusinessAccount = userRole === 'business';

  // Fetch agents and populate filter options
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        
        // First get all profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, country, city, computer_skill_level');
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          toast.error('Failed to load agent profiles');
          return;
        }

        // Then check which ones have audio
        const { data: audioData, error: audioError } = await supabase
          .from('audio_metadata')
          .select('user_id, audio_url')
          .order('created_at', { ascending: false });
        
        if (audioError) {
          console.error('Error fetching audio data:', audioError);
        }
        
        // Create a map of user IDs to audio URLs
        const audioMap = new Map<string, string>();
        audioData?.forEach(audio => {
          if (!audioMap.has(audio.user_id)) {
            audioMap.set(audio.user_id, audio.audio_url);
          }
        });

        // If business user, get favorites
        let favorites: string[] = [];
        if (isBusinessAccount && user) {
          // Use RPC function to get favorites
          const { data, error } = await supabase
            .rpc('get_business_favorites', { 
              business_user_id: user.id 
            });

          if (error) {
            console.error('Error fetching favorites:', error);
          } else if (data) {
            favorites = data as unknown as string[];
          }
        }
        
        // Map profiles to agents with audio info and favorite status
        const agentsWithAudioInfo = profiles?.map(profile => ({
          id: profile.id,
          has_audio: audioMap.has(profile.id),
          audio_url: audioMap.get(profile.id) || null,
          country: profile.country,
          city: profile.city,
          computer_skill_level: profile.computer_skill_level,
          is_favorite: favorites.includes(profile.id)
        })) || [];
        
        setAgents(agentsWithAudioInfo);
        setFilteredAgents(agentsWithAudioInfo);

        // Extract unique values for filter dropdowns
        const uniqueCountries = Array.from(
          new Set(
            agentsWithAudioInfo
              .map(agent => agent.country)
              .filter(Boolean) as string[]
          )
        ).sort();
        
        const uniqueCities = Array.from(
          new Set(
            agentsWithAudioInfo
              .map(agent => agent.city)
              .filter(Boolean) as string[]
          )
        ).sort();
        
        const uniqueSkillLevels = Array.from(
          new Set(
            agentsWithAudioInfo
              .map(agent => agent.computer_skill_level)
              .filter(Boolean) as string[]
          )
        ).sort();

        setCountries(uniqueCountries);
        setCities(uniqueCities);
        setSkillLevels(uniqueSkillLevels);
      } catch (err) {
        console.error('Unexpected error in AgentPreview:', err);
        toast.error('An error occurred while loading agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [user, userRole, isBusinessAccount]);

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

  // Watch form changes and update filters
  useEffect(() => {
    const subscription = form.watch((value) => {
      applyFilters(value as FilterValues);
    });
    
    return () => subscription.unsubscribe();
  }, [form, agents]);

  // Audio player setup
  useEffect(() => {
    if (audioPlayer) {
      audioPlayer.onended = () => {
        setIsPlaying(false);
      };
      
      return () => {
        audioPlayer.pause();
        audioPlayer.onended = null;
      };
    }
  }, [audioPlayer]);

  // Play/pause audio
  const toggleAudio = (audioUrl: string) => {
    if (currentAudio === audioUrl && isPlaying && audioPlayer) {
      audioPlayer.pause();
      setIsPlaying(false);
    } else {
      if (audioPlayer) {
        audioPlayer.pause();
      }
      
      const newAudioPlayer = new Audio(audioUrl);
      setAudioPlayer(newAudioPlayer);
      setCurrentAudio(audioUrl);
      newAudioPlayer.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Error playing audio:', err);
        toast.error('Failed to play audio');
      });
    }
  };

  // Handle favorites
  const toggleFavorite = async (agentId: string, currentStatus: boolean) => {
    if (!user) {
      toast.error('You must be logged in to add favorites');
      return;
    }

    if (userRole !== 'business') {
      toast.error('Only business accounts can add agents to favorites');
      return;
    }

    try {
      if (currentStatus) {
        // Remove from favorites using RPC function with proper typing
        const { error } = await supabase.rpc('remove_business_favorite', { 
          business_user_id: user.id, 
          agent_user_id: agentId 
        } as any); // Use type assertion to bypass TypeScript error

        if (error) throw error;
        toast.success('Agent removed from favorites');
      } else {
        // Add to favorites using RPC function with proper typing
        const { error } = await supabase.rpc('add_business_favorite', { 
          business_user_id: user.id, 
          agent_user_id: agentId 
        } as any); // Use type assertion to bypass TypeScript error

        if (error) throw error;
        toast.success('Agent added to favorites');
      }

      // Update local state
      setAgents(prevAgents => 
        prevAgents.map(agent => 
          agent.id === agentId ? { ...agent, is_favorite: !currentStatus } : agent
        )
      );
      
      setFilteredAgents(prevAgents => 
        prevAgents.map(agent => 
          agent.id === agentId ? { ...agent, is_favorite: !currentStatus } : agent
        )
      );
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast.error('Failed to update favorites');
    }
  };

  // Open audio player modal
  const openAudioModal = (agent: Agent) => {
    if (!agent.audio_url) {
      toast.error('No audio available for this agent');
      return;
    }

    setCurrentAgent(agent);
    setShowAudioModal(true);
    
    // Auto-play in modal
    if (audioPlayer) {
      audioPlayer.pause();
    }
    
    const newAudioPlayer = new Audio(agent.audio_url);
    setAudioPlayer(newAudioPlayer);
    setCurrentAudio(agent.audio_url);
    newAudioPlayer.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      console.error('Error playing audio:', err);
      toast.error('Failed to play audio');
    });
  };

  // Show agent details card with audio recordings
  const showAgentDetails = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowAgentCard(true);
  };

  // Format the user ID to show only first 8 characters
  const formatUserId = (id: string) => `${id.substring(0, 8)}...`;

  // Reset all filters
  const resetFilters = () => {
    form.reset({
      country: '',
      city: '',
      hasAudio: false,
      skillLevel: '',
    });
    setFilteredAgents(agents);
    setShowFilters(false);
  };

  // Close audio modal
  const closeAudioModal = () => {
    if (audioPlayer) {
      audioPlayer.pause();
      setIsPlaying(false);
    }
    setShowAudioModal(false);
    setCurrentAgent(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agent Preview</h1>
        
        <AgentFilters
          countries={countries}
          cities={cities}
          skillLevels={skillLevels}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          applyFilters={applyFilters}
          resetFilters={resetFilters}
          form={form}
        />
      </div>
      
      {/* Show Agent Detail Card if Selected */}
      {showAgentCard && selectedAgent && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Agent Details</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAgentCard(false)}
            >
              Close Details
            </Button>
          </div>
          <AgentDetailCard 
            agent={selectedAgent}
            isBusinessAccount={isBusinessAccount}
            formatUserId={formatUserId}
            toggleFavorite={toggleFavorite}
          />
        </div>
      )}
      
      {loading ? (
        <LoadingAgentCards />
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
              isPlaying={isPlaying}
              currentAudio={currentAudio}
              toggleFavorite={toggleFavorite}
              showAgentDetails={showAgentDetails}
              openAudioModal={openAudioModal}
              formatUserId={formatUserId}
            />
          ))}
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
