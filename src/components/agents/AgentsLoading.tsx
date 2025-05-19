
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface AgentsLoadingProps {
  count?: number;
}

const AgentsLoading: React.FC<AgentsLoadingProps> = ({ count = 6 }) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className="h-64 w-full" />
      ))}
    </div>
  );
};

export default AgentsLoading;
