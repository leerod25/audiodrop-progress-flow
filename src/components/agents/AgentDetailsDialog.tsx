
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/hooks/users/useUserFetch';
import { useUserContext } from '@/contexts/UserContext';
import AgentDetailsHeader from './AgentDetailsHeader';
import AgentAudioRecordings from './AgentAudioRecordings';
import AgentBusinessActions from './AgentBusinessActions';
import AgentDetailsInfo from './AgentDetailsInfo';
import { Agent } from '@/types/Agent';
import { toast } from 'sonner';
import AdminRatingSection from './AdminRatingSection';

interface AgentDetailsDialogProps {
  selectedAgentId: string | null;
  onClose: () => void;
  defaultTab?: string;
}

const AgentDetailsDialog: React.FC<AgentDetailsDialogProps> = ({ selectedAgentId, onClose, defaultTab = "professional" }) => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, userRole } = useUserContext();
  const isPriorityAgent = selectedAgentId?.includes('3a067ecc');

  const fetchAgentDetails = async () => {
    try {
      if (!selectedAgentId) return;
      setLoading(true);

      // Get agent profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', selectedAgentId)
        .single();

      if (error) {
        console.error('Error fetching agent:', error);
        return;
      }

      // Get agent's professional details
      const { data: professionalData } = await supabase
        .from('professional_details')
        .select('*')
        .eq('user_id', selectedAgentId)
        .single();

      // Check if user is in business favorites
      let isFavorite = false;
      if (user && userRole === 'business') {
        const { data: favoriteData } = await supabase
          .rpc('get_business_favorites', { business_user_id: user.id });
          
        isFavorite = Array.isArray(favoriteData) && favoriteData.includes(selectedAgentId);
      }

      // Fetch audio files from storage
      let audioUrls: Array<{id: string, title: string, url: string, updated_at: string}> = [];
      try {
        const { data: filesList, error: storageError } = await supabase
          .storage
          .from('audio-bucket')
          .list(selectedAgentId, {
            sortBy: { column: 'created_at', order: 'desc' }
          });

        if (!storageError && filesList && filesList.length > 0) {
          console.log(`Found ${filesList.length} files in storage for agent ${selectedAgentId}`);
          
          const audioFiles = filesList
            .filter(file => {
              const isAudio = file.name.endsWith('.webm') || 
                              file.name.endsWith('.mp3') || 
                              file.name.endsWith('.wav') ||
                              file.name.endsWith('.m4a') ||
                              file.name.endsWith('.ogg');
              return isAudio;
            })
            .map((file) => {
              const { data: publicURL } = supabase
                .storage
                .from('audio-bucket')
                .getPublicUrl(`${selectedAgentId}/${file.name}`);
              
              if (publicURL && publicURL.publicUrl) {
                const title = file.name.split('.').slice(0, -1).join('.') || file.name;
                
                return {
                  id: file.id || `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                  title: title || 'Untitled Recording',
                  url: publicURL.publicUrl,
                  updated_at: file.created_at || new Date().toISOString()
                };
              }
              return null;
            })
            .filter(Boolean) as Array<{id: string, title: string, url: string, updated_at: string}>;

          audioUrls = audioFiles;
          console.log(`Agent ${selectedAgentId} has ${audioUrls.length} valid audio files`);
        }
      } catch (audioError) {
        console.error('Error fetching audio files:', audioError);
      }

      // Create agent object
      setAgent({
        id: selectedAgentId,
        email: data?.email || '',
        created_at: data?.created_at || new Date().toISOString(),
        has_audio: audioUrls.length > 0,
        audio_url: null,
        country: data?.country || null,
        city: data?.city || null,
        computer_skill_level: data?.computer_skill_level || null,
        years_experience: professionalData?.years_experience || null,
        languages: professionalData?.languages || [],
        is_favorite: isFavorite,
        is_available: !!professionalData,
        audioUrls: audioUrls
      });
    } catch (err) {
      console.error('Error fetching agent details:', err);
      toast.error('Failed to load agent details');
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (agentId: string, currentStatus: boolean) => {
    try {
      if (!user) return;
      
      const functionName = currentStatus ? 'remove_business_favorite' : 'add_business_favorite';
      
      const { error } = await supabase.rpc(
        functionName, 
        { 
          business_user_id: user.id, 
          agent_user_id: agentId 
        }
      );
      
      if (error) {
        console.error(`Error toggling favorite:`, error);
        toast.error('Failed to update team');
        return;
      }
      
      // Update local state
      setAgent(prev => prev ? {
        ...prev,
        is_favorite: !currentStatus
      } : null);
      
      toast.success(currentStatus ? 'Agent removed from team' : 'Agent added to team');
    } catch (err) {
      console.error('Error in toggleFavorite:', err);
      toast.error('Failed to update team');
    }
  };

  useEffect(() => {
    if (selectedAgentId) {
      fetchAgentDetails();
    }
  }, [selectedAgentId]);

  if (!selectedAgentId) return null;

  return (
    <Dialog open={!!selectedAgentId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isPriorityAgent ? "Mission Statement" : `Agent ID: ${selectedAgentId.substring(0, 8)}...`}
          </DialogTitle>
          <DialogDescription>
            View agent details and audio recordings
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : agent ? (
          <div className="space-y-6">
            <AgentDetailsHeader agent={agent} isPriorityAgent={isPriorityAgent} />
            <AgentDetailsInfo agent={agent} />
            
            {/* Admin Rating Section */}
            <AdminRatingSection agent={agent} />
            
            <AgentAudioRecordings 
              agent={agent} 
              isOwnProfile={user?.id === agent.id} 
              onRecordingDeleted={fetchAgentDetails}
            />
            {userRole === 'business' && (
              <AgentBusinessActions 
                agent={agent}
                toggleFavorite={toggleFavorite}  
              />
            )}
          </div>
        ) : (
          <p className="text-center py-4">Agent not found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AgentDetailsDialog;
