
import React from 'react';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ProfessionalDetailsFormReadOnly from '@/components/ProfessionalDetailsFormReadOnly';

interface AgentDetailsDialogProps {
  selectedAgentId: string | null;
  onClose: () => void;
}

const AgentDetailsDialog: React.FC<AgentDetailsDialogProps> = ({ 
  selectedAgentId, 
  onClose 
}) => {
  return (
    <Dialog open={!!selectedAgentId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Agent Professional Details</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Review this agent's professional qualifications and experience
          </DialogDescription>
        </DialogHeader>
        
        {selectedAgentId && <ProfessionalDetailsFormReadOnly userId={selectedAgentId} />}
      </DialogContent>
    </Dialog>
  );
};

export default AgentDetailsDialog;
