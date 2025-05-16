
import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter } from 'lucide-react';

interface FilterHeaderProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  resetFilters: () => void;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({
  showFilters,
  setShowFilters,
  resetFilters
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-1"
      >
        <Filter className="h-4 w-4" />
        Filters {showFilters ? '↑' : '↓'}
      </Button>
      
      {showFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters}
        >
          Reset
        </Button>
      )}
    </div>
  );
};

export default FilterHeader;
