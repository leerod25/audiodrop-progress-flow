
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AgentsPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const AgentsPagination: React.FC<AgentsPaginationProps> = ({ page, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center space-x-2 items-center">
      <Button 
        variant="outline" 
        size="icon"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="text-sm">
        Page {page} of {totalPages}
      </div>
      
      <Button 
        variant="outline" 
        size="icon"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AgentsPagination;
