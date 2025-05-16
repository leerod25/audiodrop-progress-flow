
import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6 max-w-3xl">
      <Card className="bg-white shadow-md mb-8">
        <CardHeader>
          <Skeleton className="h-8 w-36" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSkeleton;
