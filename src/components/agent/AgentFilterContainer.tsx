
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Agent } from '@/types/Agent';

interface AgentFilterContainerProps {
  /** Callback to supply all users to parent component */
  onApplyFilters: (agents: Agent[]) => void;
}

/**
 * Simplest loader: fetches all profiles from Supabase and passes them up.
 */
const AgentFilterContainer: React.FC<AgentFilterContainerProps> = ({ onApplyFilters }) => {
  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching users:', error);
          onApplyFilters([]);
        } else {
          onApplyFilters(data || []);
        }
      });
  }, [onApplyFilters]);

  return null; // No UI
};

export default AgentFilterContainer;
