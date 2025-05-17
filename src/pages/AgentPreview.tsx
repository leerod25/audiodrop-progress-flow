import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Agent } from '@/types/Agent';
import AgentDetailCard from '@/components/agent/AgentDetailCard';
import { useUserContext } from '@/contexts/UserContext';

const AgentPreview: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userRole } = useUserContext();

  useEffect(() => {
    async function loadAgents() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          console.error('Error fetching users:', error);
          setAgents([]);
          return;
        }
        
        console.log('Raw profiles data:', data);
        
        // Transform profiles data to match Agent interface
        const transformedAgents: Agent[] = (data || []).map(profile => ({
          id: profile.id,
          has_audio: true, // Default value for demonstration
          audio_url: null,
          country: profile.country,
          city: profile.city,
          computer_skill_level: profile.computer_skill_level,
          is_favorite: false // Default value
        }));
        
        setAgents(transformedAgents);
      } catch (err) {
        console.error('Unexpected error loading agents:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadAgents();
  }, []);

  // Simple function to format user IDs for display
  const formatUserId = (id: string) => {
    return id.substring(0, 8) + '...';
  };

  // Dummy function for favorite toggle since we're keeping it simple
  const toggleFavorite = (agentId: string, currentStatus: boolean) => {
    console.log('Toggle favorite:', agentId, currentStatus);
    // In a real app, this would call an API to update favorites
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Agent Preview</h1>
      
      {/* Debug: show count and raw data */}
      <p className="mb-4">Found {agents.length} users.</p>
      <pre className="bg-gray-100 p-4 mb-6 overflow-auto max-h-40">{JSON.stringify(agents, null, 2)}</pre>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Loading users...</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {agents.map(agent => (
            <AgentDetailCard
              key={agent.id}
              agent={agent}
              isBusinessAccount={userRole === 'business'}
              formatUserId={formatUserId}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentPreview;
