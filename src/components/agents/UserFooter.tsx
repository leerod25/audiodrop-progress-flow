
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock, PlayCircle } from 'lucide-react';

interface UserFooterProps {
  isExpanded: boolean;
  toggleExpand: () => void;
  audioFilesCount: number;
  showLoginPrompt?: boolean;
}

const UserFooter: React.FC<UserFooterProps> = ({
  isExpanded,
  toggleExpand,
  audioFilesCount,
  showLoginPrompt = false
}) => {
  return (
    <div className="w-full flex justify-between items-center">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-blue-600 p-0"
        onClick={toggleExpand}
      >
        {isExpanded ? 'Show Less' : 'Show More'}
      </Button>
      
      <div className="flex gap-2">
        {showLoginPrompt ? (
          <Button asChild variant="outline" size="sm" className="flex items-center gap-1">
            <Link to="/auth">
              <Lock className="h-3 w-3" />
              View Full Profile
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <PlayCircle className="h-3 w-3" />
            {audioFilesCount} Samples
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserFooter;
