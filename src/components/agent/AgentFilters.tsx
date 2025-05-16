
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import FilterDropdown from './filters/FilterDropdown';
import HasAudioCheckbox from './filters/HasAudioCheckbox';
import FilterHeader from './filters/FilterHeader';
import FavoritesToggle from './filters/FavoritesToggle';

export interface FilterValues {
  country: string;
  city: string;
  hasAudio: boolean;
  skillLevel: string;
  favoritesOnly: boolean;
}

interface AgentFiltersProps {
  countries: string[];
  cities: string[];
  skillLevels: string[];
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  applyFilters: (values: FilterValues) => void;
  resetFilters: () => void;
  form: ReturnType<typeof useForm<FilterValues>>;
  isBusinessAccount: boolean;
}

const AgentFilters: React.FC<AgentFiltersProps> = ({
  countries,
  cities,
  skillLevels,
  showFilters,
  setShowFilters,
  resetFilters,
  form,
  isBusinessAccount
}) => {
  return (
    <>
      <FilterHeader 
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        resetFilters={resetFilters}
      />
      
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Form {...form}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Country dropdown */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FilterDropdown 
                      label="Country"
                      field={field}
                      options={countries}
                      placeholder="Select country"
                    />
                  )}
                />
                
                {/* City dropdown */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FilterDropdown 
                      label="City"
                      field={field}
                      options={cities}
                      placeholder="Select city"
                    />
                  )}
                />
                
                {/* Skill level dropdown */}
                <FormField
                  control={form.control}
                  name="skillLevel"
                  render={({ field }) => (
                    <FilterDropdown 
                      label="Skill Level"
                      field={field}
                      options={skillLevels}
                      placeholder="Select skill level"
                    />
                  )}
                />
                
                {/* Has Audio checkbox */}
                <FormField
                  control={form.control}
                  name="hasAudio"
                  render={({ field }) => (
                    <HasAudioCheckbox field={field} />
                  )}
                />

                {/* Favorites toggle - only shown for business users */}
                <FormField
                  control={form.control}
                  name="favoritesOnly"
                  render={({ field }) => (
                    <FavoritesToggle field={field} isBusinessAccount={isBusinessAccount} />
                  )}
                />
              </div>
            </Form>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AgentFilters;
