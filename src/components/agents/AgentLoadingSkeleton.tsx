
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AgentLoadingSkeletonProps {
  count?: number;
}

const AgentLoadingSkeleton: React.FC<AgentLoadingSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4 mt-4">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex justify-between mt-4">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AgentLoadingSkeleton;
