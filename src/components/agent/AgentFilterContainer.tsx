
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import AgentFilters, { FilterValues } from '@/components/agent/AgentFilters';
import { Agent } from '@/types/Agent';
import { Button } from '@/components/ui/button';

interface AgentFilterContainerProps {
  agents: Agent[];
  countries: string[];
  cities: string[];
  skillLevels: string[];
  onApplyFilters: (agents: Agent[]) => void;
  isBusinessAccount: boolean;
}

const AgentFilterContainer: React.FC<AgentFilterContainerProps> = ({
  agents,
  countries,
  cities,
  skillLevels,
  onApplyFilters,
  isBusinessAccount
}) => {
  const [showFilters, setShowFilters] = React.useState(false);
  
  const form = useForm<FilterValues>({
    defaultValues: {
      country: '',
      city: '',
      hasAudio: false,
      skillLevel: '',
      favoritesOnly: false,
    },
  });

  // Apply filters whenever form values change
  const applyFilters = (values: FilterValues) => {
    let result = [...agents];
    
    if (values.country) {
      result = result.filter(agent => agent.country === values.country);
    }
    
    if (values.city) {
      result = result.filter(agent => agent.city === values.city);
    }
    
    if (values.hasAudio) {
      result = result.filter(agent => agent.has_audio);
    }
    
    if (values.skillLevel) {
      result = result.filter(agent => agent.computer_skill_level === values.skillLevel);
    }
    
    if (values.favoritesOnly && isBusinessAccount) {
      result = result.filter(agent => agent.is_favorite);
    }
    
    onApplyFilters(result);
  };

  // Watch form changes and update filters
  useEffect(() => {
    const subscription = form.watch((value) => {
      applyFilters(value as FilterValues);
    });
    
    return () => subscription.unsubscribe();
  }, [form, agents]);

  // Reset filters
  const resetFilters = () => {
    form.reset({
      country: '',
      city: '',
      hasAudio: false,
      skillLevel: '',
      favoritesOnly: false,
    });
    onApplyFilters(agents);
    setShowFilters(false);
  };

  return (
    <>
      <AgentFilters
        countries={countries}
        cities={cities}
        skillLevels={skillLevels}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
        form={form}
        isBusinessAccount={isBusinessAccount}
      />

      {/* No Results Message */}
      {agents.length > 0 && onApplyFilters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No agents found matching your filters.</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </>
  );
};

export default AgentFilterContainer;
