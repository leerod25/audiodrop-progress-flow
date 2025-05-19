
import React from 'react';
import { Button } from '@/components/ui/button';

interface AgentListPaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

const AgentListPagination: React.FC<AgentListPaginationProps> = ({
  page,
  totalPages,
  setPage
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-6 gap-2">
      <Button 
        variant="outline" 
        onClick={() => setPage(p => Math.max(1, p - 1))} 
        disabled={page === 1}
      >
        Previous
      </Button>
      <div className="flex items-center px-4">
        Page {page} of {totalPages}
      </div>
      <Button 
        variant="outline" 
        onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
        disabled={page === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default AgentListPagination;
