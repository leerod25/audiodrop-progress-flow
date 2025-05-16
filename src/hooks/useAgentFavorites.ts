
import { useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';
import { Agent } from '@/types/agent';

export function useAgentFavorites(
  agents: Agent[], 
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>,
  filteredAgents: Agent[], 
  setFilteredAgents: React.Dispatch<React.SetStateAction<Agent[]>>,
  userId: string | undefined, 
  userRole: string | null,
  useFakeData: boolean
) {
  const supabase = useSupabaseClient();
  const isBusinessAccount = userRole === 'business';
  
  // Load favorites when user or role changes
  useEffect(() => {
    const loadFavorites = async () => {
      if (!userId || userRole !== 'business') return;
      
      if (useFakeData) return; // Don't load favorites for fake data
      
      try {
        // Use RPC function to get favorites
        const { data, error } = await supabase
          .rpc('get_business_favorites', { 
            business_user_id: userId 
          });

        if (error) {
          console.error('Error fetching favorites:', error);
          return;
        }
        
        if (data) {
          const favorites = data as unknown as string[];
          
          // Update agents with favorite status
          setAgents(prevAgents => 
            prevAgents.map(agent => ({
              ...agent,
              is_favorite: favorites.includes(agent.id)
            }))
          );
          
          // Update filtered agents with favorite status
          setFilteredAgents(prevAgents => 
            prevAgents.map(agent => ({
              ...agent,
              is_favorite: favorites.includes(agent.id)
            }))
          );
        }
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    };
    
    loadFavorites();
  }, [userId, userRole, useFakeData, setAgents, setFilteredAgents, supabase]);
  
  // Toggle favorites
  const toggleFavorite = async (agentId: string, currentStatus: boolean) => {
    if (!userId) {
      toast.error('You must be logged in to add favorites');
      return;
    }

    if (userRole !== 'business') {
      toast.error('Only business accounts can add agents to favorites');
      return;
    }

    try {
      // If using fake data, just update the local state
      if (useFakeData) {
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
        
        toast.success(currentStatus ? 'Agent removed from favorites' : 'Agent added to favorites');
        return;
      }

      if (currentStatus) {
        // Remove from favorites using RPC function with proper typing
        const { error } = await supabase.rpc('remove_business_favorite', { 
          business_user_id: userId, 
          agent_user_id: agentId 
        } as any); // Use type assertion to bypass TypeScript error

        if (error) throw error;
        toast.success('Agent removed from favorites');
      } else {
        // Add to favorites using RPC function with proper typing
        const { error } = await supabase.rpc('add_business_favorite', { 
          business_user_id: userId, 
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

  return { toggleFavorite };
}
