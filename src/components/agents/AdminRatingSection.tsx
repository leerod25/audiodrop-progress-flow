
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserContext } from '@/contexts/UserContext';
import { useAgentRatings } from '@/hooks/useAgentRatings';
import StarRating from './StarRating';
import { Agent } from '@/types/Agent';

interface AdminRatingSectionProps {
  agent: Agent;
}

const AdminRatingSection: React.FC<AdminRatingSectionProps> = ({ agent }) => {
  const { user, userRole } = useUserContext();
  const isAdmin = userRole === 'admin';
  
  const { getRatingForAgent, addOrUpdateRating, loading } = useAgentRatings(
    isAdmin ? user?.id || null : null
  );

  // Don't render if not admin
  if (!isAdmin) return null;

  const currentRating = getRatingForAgent(agent.id);

  const handleRatingChange = async (rating: number) => {
    try {
      await addOrUpdateRating(agent.id, rating);
    } catch (err) {
      console.error('Failed to update rating:', err);
    }
  };

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
          <span>Admin Rating</span>
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-600"></div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-purple-700">
            Rate this agent's performance (supports half-star ratings)
          </p>
          <StarRating
            rating={currentRating}
            onRatingChange={handleRatingChange}
            readonly={loading}
            size="lg"
            allowHalfStars={true}
          />
          {currentRating && (
            <p className="text-xs text-purple-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRatingSection;
