
import React, { useEffect, useState } from 'react';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import AgentDetailCard from '@/components/agent/AgentDetailCard';
import ProfessionalDetailsFormReadOnly from '@/components/professional/ProfessionalDetailsFormReadOnly';
import { useUserContext } from '@/contexts/UserContext';
import { Agent } from '@/types/Agent';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgentDetailsDialogProps {
  selectedAgentId: string | null;
  onClose: () => void;
  defaultTab?: "recordings" | "professional";
}

const AgentDetailsDialog: React.FC<AgentDetailsDialogProps> = ({ 
  selectedAgentId, 
  onClose,
  defaultTab = "recordings" 
}) => {
  const { userRole, user } = useUserContext();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [professionalDetails, setProfessionalDetails] = useState<any>(null);

  // When selectedAgentId changes, fetch agent details
  useEffect(() => {
    if (!selectedAgentId) {
      setAgent(null);
      return;
    }
    
    setLoading(true);
    
    const fetchAgentDetails = async () => {
      try {
        // Fetch agent profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', selectedAgentId)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return;
        }
        
        // Fetch agent's audio files
        const { data: audioFiles, error: audioError } = await supabase
          .from('audio_metadata')
          .select('*')
          .eq('user_id', selectedAgentId);
          
        if (audioError) {
          console.error('Error fetching audio files:', audioError);
        }
        
        // Fetch professional details
        const { data: professionalData } = await supabase
          .from('professional_details')
          .select('*')
          .eq('user_id', selectedAgentId)
          .single();
          
        setProfessionalDetails(professionalData || null);

        // Check if this agent is a favorite (if user is a business)
        let isFavorite = false;
        if (user && userRole === 'business') {
          const { data: favorites } = await supabase
            .rpc('get_business_favorites', { business_user_id: user.id });
          
          if (favorites && Array.isArray(favorites)) {
            isFavorite = favorites.includes(selectedAgentId);
          }
        }
        
        // Create the agent object with proper null checks for arrays
        setAgent({
          id: selectedAgentId,
          has_audio: (audioFiles?.length || 0) > 0,
          country: profileData?.country || null,
          city: profileData?.city || null,
          computer_skill_level: professionalData?.computer_skill_level || profileData?.computer_skill_level || null,
          is_favorite: isFavorite,
          audioUrls: Array.isArray(audioFiles) ? audioFiles.map(file => ({
            id: file.id || '',
            title: file.title || `Recording`,
            url: file.audio_url || '',
            updated_at: file.created_at || ''
          })) : [],
          // Add private fields for admin users
          full_name: profileData?.full_name || null,
          email: profileData?.email || null,
          phone: profileData?.phone || null,
          bio: profileData?.bio || null
        });
      } catch (err) {
        console.error('Error fetching agent data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentDetails();
  }, [selectedAgentId, user, userRole]);

  // Dummy function for toggling favorite - replace with your actual implementation
  const toggleFavorite = async (agentId: string, currentStatus: boolean) => {
    if (!user || userRole !== 'business') return;
    
    try {
      if (currentStatus) {
        // Remove from favorites
        await supabase.rpc('remove_business_favorite', { 
          business_user_id: user.id, 
          agent_user_id: agentId 
        });
      } else {
        // Add to favorites
        await supabase.rpc('add_business_favorite', { 
          business_user_id: user.id, 
          agent_user_id: agentId 
        });
      }
      
      // Update the agent state to reflect the change in UI
      setAgent(prev => prev ? { ...prev, is_favorite: !currentStatus } : null);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Format user ID to show a subset
  const formatUserId = (id: string) => `${id.substring(0, 8)}...`;

  return (
    <Dialog open={!!selectedAgentId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Agent Details</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Review this agent's professional qualifications and audio recordings
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="p-8 text-center">Loading agent details...</div>
        ) : agent ? (
          <div className="space-y-6">
            <Tabs defaultValue={defaultTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="recordings">Audio Recordings</TabsTrigger>
                <TabsTrigger value="professional">Professional Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recordings">
                <AgentDetailCard 
                  agent={agent}
                  isBusinessAccount={userRole === 'business'}
                  formatUserId={formatUserId}
                  toggleFavorite={toggleFavorite}
                />
              </TabsContent>
              
              <TabsContent value="professional">
                <ProfessionalDetailsFormReadOnly 
                  professionalDetails={professionalDetails} 
                />
              </TabsContent>
            </Tabs>
            
            {userRole === 'business' && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2">Your Selection</h3>
                <p>
                  {agent.is_favorite ? (
                    <span className="text-green-600">✓ This agent is in your team</span>
                  ) : (
                    <span className="text-gray-500">This agent is not in your team</span>
                  )}
                </p>
                <Button
                  className="mt-2"
                  variant={agent.is_favorite ? "destructive" : "default"}
                  onClick={() => toggleFavorite(agent.id, agent.is_favorite)}
                >
                  {agent.is_favorite ? "Remove from Team" : "Add to Team"}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-red-500">
            Failed to load agent details. Please try again.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AgentDetailsDialog;
