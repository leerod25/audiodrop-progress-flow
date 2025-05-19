
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface AgentFilterBarProps {
  countries: string[];
  cities: string[];
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  searchQuery: string;
  country: string;
  city: string;
  availableOnly: boolean;
  experiencedOnly: boolean;
}

const AgentFilterBar: React.FC<AgentFilterBarProps> = ({
  countries,
  cities,
  onFilterChange
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    country: '',
    city: '',
    availableOnly: false,
    experiencedOnly: false
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const resetFiltersState = {
      searchQuery: '',
      country: '',
      city: '',
      availableOnly: false,
      experiencedOnly: false
    };
    setFilters(resetFiltersState);
    onFilterChange(resetFiltersState);
  };

  const activeFilterCount = Object.values(filters).filter(value => {
    if (typeof value === 'boolean') return value;
    return value !== '';
  }).length;

  return (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search agents by name or location"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          />
        </div>
        
        <Button 
          variant={showFilters ? "default" : "outline"} 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>
      
      {/* Extended Filters Panel */}
      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Country Filter */}
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select 
                value={filters.country} 
                onValueChange={(value) => handleFilterChange('country', value)}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Any country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any country</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* City Filter */}
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Select 
                value={filters.city} 
                onValueChange={(value) => handleFilterChange('city', value)}
                disabled={!filters.country}
              >
                <SelectTrigger id="city">
                  <SelectValue placeholder="Any city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any city</SelectItem>
                  {cities.filter(city => {
                    // Show all cities if no country selected
                    if (!filters.country) return true;
                    // This is a simplified approach - in reality, you'd need city/country mapping
                    return true;
                  }).map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Checkbox Filters */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="available-filter"
                  checked={filters.availableOnly}
                  onCheckedChange={(checked) => 
                    handleFilterChange('availableOnly', checked === true)
                  }
                />
                <Label htmlFor="available-filter">Available now</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="experienced-filter"
                  checked={filters.experiencedOnly}
                  onCheckedChange={(checked) => 
                    handleFilterChange('experiencedOnly', checked === true)
                  }
                />
                <Label htmlFor="experienced-filter">Experienced (3+ years)</Label>
              </div>
            </div>
            
            {/* Reset Button */}
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Reset filters
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AgentFilterBar;
