
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AgentRating {
  id: string;
  admin_id: string;
  agent_id: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

interface UseAgentRatingsResult {
  ratings: AgentRating[];
  loading: boolean;
  error: string | null;
  addOrUpdateRating: (agentId: string, rating: number) => Promise<void>;
  getRatingForAgent: (agentId: string) => number | null;
}

export function useAgentRatings(adminId: string | null): UseAgentRatingsResult {
  const [ratings, setRatings] = useState<AgentRating[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all ratings for the current admin
  useEffect(() => {
    if (!adminId) {
      setRatings([]);
      return;
    }

    const fetchRatings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('agent_ratings')
          .select('*')
          .eq('admin_id', adminId);

        if (error) throw error;
        setRatings(data || []);
      } catch (err: any) {
        console.error('Error fetching ratings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [adminId]);

  // Add or update a rating for an agent
  const addOrUpdateRating = async (agentId: string, rating: number): Promise<void> => {
    if (!adminId) return;

    try {
      const { data, error } = await supabase
        .from('agent_ratings')
        .upsert({
          admin_id: adminId,
          agent_id: agentId,
          rating: rating,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setRatings(prev => {
        const existingIndex = prev.findIndex(r => r.agent_id === agentId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = data;
          return updated;
        } else {
          return [...prev, data];
        }
      });

      toast.success('Agent rating updated successfully');
    } catch (err: any) {
      console.error('Error updating rating:', err);
      toast.error('Failed to update rating');
      throw err;
    }
  };

  // Get rating for a specific agent
  const getRatingForAgent = (agentId: string): number | null => {
    const rating = ratings.find(r => r.agent_id === agentId);
    return rating ? rating.rating : null;
  };

  return {
    ratings,
    loading,
    error,
    addOrUpdateRating,
    getRatingForAgent
  };
}
