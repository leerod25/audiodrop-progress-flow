
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AverageRating {
  agent_id: string;
  average_rating: number;
  total_ratings: number;
}

interface UseAgentAverageRatingsResult {
  averageRatings: Record<string, number>;
  loading: boolean;
  error: string | null;
  getSortedAgentIds: () => string[];
}

export function useAgentAverageRatings(): UseAgentAverageRatingsResult {
  const [averageRatings, setAverageRatings] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAverageRatings = async () => {
      setLoading(true);
      try {
        // Fetch average ratings for all agents
        const { data, error } = await supabase
          .from('agent_ratings')
          .select('agent_id, rating');

        if (error) throw error;

        // Calculate average ratings per agent
        const ratingsMap: Record<string, number[]> = {};
        data?.forEach(rating => {
          if (!ratingsMap[rating.agent_id]) {
            ratingsMap[rating.agent_id] = [];
          }
          ratingsMap[rating.agent_id].push(rating.rating);
        });

        // Convert to average ratings
        const averages: Record<string, number> = {};
        Object.entries(ratingsMap).forEach(([agentId, ratings]) => {
          const sum = ratings.reduce((acc, rating) => acc + rating, 0);
          averages[agentId] = Math.round((sum / ratings.length) * 10) / 10; // Round to 1 decimal place
        });

        setAverageRatings(averages);
      } catch (err: any) {
        console.error('Error fetching average ratings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAverageRatings();
  }, []);

  // Function to get agent IDs sorted by rating (highest to lowest)
  const getSortedAgentIds = (): string[] => {
    return Object.entries(averageRatings)
      .sort(([, ratingA], [, ratingB]) => ratingB - ratingA)
      .map(([agentId]) => agentId);
  };

  return {
    averageRatings,
    loading,
    error,
    getSortedAgentIds
  };
}
