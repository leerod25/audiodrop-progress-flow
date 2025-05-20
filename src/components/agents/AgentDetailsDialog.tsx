
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
import { useUserContext } from '@/contexts/UserContext';
import { Agent } from '@/types/Agent';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import AgentAudioRecordings from './AgentAudioRecordings';
import ProfessionalDetailsFormReadOnly from '@/components/professional/ProfessionalDetailsFormReadOnly';
import AgentBusinessActions from './AgentBusinessActions';

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

  // Check if current user is viewing their own profile
  const isOwnProfile = user && selectedAgentId === user.id;

  // When selectedAgentId changes, fetch agent details
  useEffect(() => {
    if (!selectedAgentId) {
      setAgent(null);
      return;
    }
    
    setLoading(true);
    fetchAgentDetails();
  }, [selectedAgentId, user, userRole]);
  
  // Extract fetchAgentDetails to its own function so we can call it again after data changes
  const fetchAgentDetails = async () => {
    if (!selectedAgentId) return;
    
    try {
      // Fetch agent profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', selectedAgentId)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast.error("Error loading agent profile");
        return;
      }
      
      // Fetch agent's audio files
      const { data: audioFiles, error: audioError } = await supabase
        .from('audio_metadata')
        .select('*')
        .eq('user_id', selectedAgentId);
        
      if (audioError) {
        console.error('Error fetching audio files:', audioError);
        toast.error("Error loading audio recordings");
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
        email: profileData?.email || '',
        created_at: profileData?.created_at || new Date().toISOString(),
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
        phone: profileData?.phone || null,
        bio: profileData?.bio || null
      });
    } catch (err) {
      console.error('Error fetching agent data:', err);
      toast.error('Failed to load agent details');
    } finally {
      setLoading(false);
    }
  };

  // Function for toggling favorite
  const toggleFavorite = async (agentId: string, currentStatus: boolean) => {
    if (!user || userRole !== 'business') return;
    
    try {
      if (currentStatus) {
        // Remove from favorites
        await supabase.rpc('remove_business_favorite', { 
          business_user_id: user.id, 
          agent_user_id: agentId 
        });
        toast.success('Agent removed from your team');
      } else {
        // Add to favorites
        await supabase.rpc('add_business_favorite', { 
          business_user_id: user.id, 
          agent_user_id: agentId 
        });
        toast.success('Agent added to your team');
      }
      
      // Update the agent state to reflect the change in UI
      setAgent(prev => prev ? { ...prev, is_favorite: !currentStatus } : null);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update team status');
    }
  };

  // Format user ID to show a subset
  const formatUserId = (id: string) => `${id.substring(0, 8)}...`;

  // Handle successful recording deletion
  const handleRecordingDeleted = () => {
    toast.success("Recording deleted successfully");
    fetchAgentDetails(); // Refresh all agent data
  };

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
                <AgentAudioRecordings
                  agent={agent}
                  isBusinessAccount={userRole === 'business'}
                  formatUserId={formatUserId}
                  isOwnProfile={isOwnProfile}
                  onRecordingDeleted={handleRecordingDeleted}
                />
              </TabsContent>
              
              <TabsContent value="professional">
                <ProfessionalDetailsFormReadOnly 
                  professionalDetails={professionalDetails} 
                />
              </TabsContent>
            </Tabs>
            
            {userRole === 'business' && (
              <AgentBusinessActions 
                agent={agent} 
                toggleFavorite={toggleFavorite} 
              />
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
