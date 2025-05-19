
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface UsersErrorProps {
  error: string;
  onRetry: () => Promise<void>;
}

const UsersError: React.FC<UsersErrorProps> = ({ error, onRetry }) => {
  return (
    <Card className="p-6 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <h3 className="text-lg font-medium">Error Loading Agent Profiles</h3>
        <p className="text-gray-500">{error}</p>
        <Button onClick={onRetry}>Retry Loading</Button>
      </div>
    </Card>
  );
};

export default UsersError;
