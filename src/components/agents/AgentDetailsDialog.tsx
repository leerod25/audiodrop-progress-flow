
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
import { useUserContext } from '@/contexts/UserContext';
import { Agent } from '@/types/Agent';

interface AgentDetailsDialogProps {
  selectedAgentId: string | null;
  onClose: () => void;
}

const AgentDetailsDialog: React.FC<AgentDetailsDialogProps> = ({ 
  selectedAgentId, 
  onClose 
}) => {
  const { userRole } = useUserContext();
  const [agent, setAgent] = useState<Agent | null>(null);

  // When selectedAgentId changes, fetch agent details (simplified for this example)
  useEffect(() => {
    if (!selectedAgentId) return;
    
    // For now, we'll create a basic agent object with the ID
    // In a real app, you'd fetch the complete agent data
    setAgent({
      id: selectedAgentId,
      has_audio: true,
      country: "Loading...",
      city: null,
      computer_skill_level: null,
      is_favorite: false,
      audioUrls: []  // This will use the useAgentAudio hook inside AgentDetailCard
    });
  }, [selectedAgentId]);

  // Dummy function for toggling favorite - replace with your actual implementation
  const toggleFavorite = (agentId: string, currentStatus: boolean) => {
    console.log('Toggle favorite', agentId, currentStatus);
    // Update the agent state to reflect the change in UI
    setAgent(prev => prev ? { ...prev, is_favorite: !currentStatus } : null);
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
        
        {agent && (
          <div className="space-y-6">
            <AgentDetailCard 
              agent={agent}
              isBusinessAccount={userRole === 'business'}
              formatUserId={formatUserId}
              toggleFavorite={toggleFavorite}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AgentDetailsDialog;
