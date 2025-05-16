
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Filter } from 'lucide-react';
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface FilterValues {
  country: string;
  city: string;
  hasAudio: boolean;
  skillLevel: string;
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
}

const AgentFilters: React.FC<AgentFiltersProps> = ({
  countries,
  cities,
  skillLevels,
  showFilters,
  setShowFilters,
  resetFilters,
  form
}) => {
  return (
    <>
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
                    <FormItem>
                      <Label>Country</Label>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                              {field.value || "Select country"}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuItem onClick={() => field.onChange("")}>
                              Any
                            </DropdownMenuItem>
                            {countries.map((country) => (
                              <DropdownMenuItem 
                                key={country} 
                                onClick={() => field.onChange(country)}
                              >
                                {country}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {/* City dropdown */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <Label>City</Label>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                              {field.value || "Select city"}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuItem onClick={() => field.onChange("")}>
                              Any
                            </DropdownMenuItem>
                            {cities.map((city) => (
                              <DropdownMenuItem 
                                key={city} 
                                onClick={() => field.onChange(city)}
                              >
                                {city}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {/* Skill level dropdown */}
                <FormField
                  control={form.control}
                  name="skillLevel"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Skill Level</Label>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                              {field.value || "Select skill level"}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuItem onClick={() => field.onChange("")}>
                              Any
                            </DropdownMenuItem>
                            {skillLevels.map((level) => (
                              <DropdownMenuItem 
                                key={level} 
                                onClick={() => field.onChange(level)}
                              >
                                {level}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {/* Has Audio checkbox */}
                <FormField
                  control={form.control}
                  name="hasAudio"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 space-y-0 pt-6">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label>Has Audio Only</Label>
                    </FormItem>
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
