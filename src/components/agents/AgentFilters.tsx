
import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { addDays, format, isAfter, isBefore, isValid } from "date-fns";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface AgentFiltersProps {
  emailFilter: string;
  setEmailFilter: (value: string) => void;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  setDateRange: (range: { from: Date | null; to: Date | null }) => void;
  resetFilters: () => void;
  isCalendarOpen?: boolean;
  setIsCalendarOpen?: (open: boolean) => void;
}

const AgentFilters: React.FC<AgentFiltersProps> = ({
  emailFilter,
  setEmailFilter,
  dateRange,
  setDateRange,
  resetFilters,
  isCalendarOpen,
  setIsCalendarOpen
}) => {
  const [localCalendarOpen, setLocalCalendarOpen] = React.useState(false);
  
  const isOpen = isCalendarOpen !== undefined ? isCalendarOpen : localCalendarOpen;
  const setIsOpen = setIsCalendarOpen || setLocalCalendarOpen;
  
  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
    }
    if (dateRange.from) {
      return `From ${format(dateRange.from, 'MMM d, yyyy')}`;
    }
    if (dateRange.to) {
      return `Until ${format(dateRange.to, 'MMM d, yyyy')}`;
    }
    return 'Select date range';
  };

  // If we're rendering inside a mobile sheet
  if (setIsCalendarOpen !== undefined) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Filter Agents</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                type="text" 
                placeholder="Filter by email"
                className="pl-8"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
              />
            </div>
            
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left font-normal flex items-center"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{formatDateRange()}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from || new Date()}
                    selected={{
                      from: dateRange.from || undefined,
                      to: dateRange.to || undefined
                    }}
                    onSelect={(range) => {
                      setDateRange({
                        from: range?.from || null,
                        to: range?.to || null
                      });
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <Button 
              variant="default"
              onClick={() => {
                resetFilters();
                setIsOpen(false);
              }}
              className="w-full"
            >
              Apply Filters
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                resetFilters();
                setIsOpen(false);
              }}
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop filters
  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Email search */}
        <div className="col-span-2 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            type="text" 
            placeholder="Filter by email"
            className="pl-8"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
          />
        </div>
        
        {/* Date range */}
        <div className="col-span-2">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left font-normal flex items-center"
              >
                <Calendar className="mr-2 h-4 w-4" />
                <span>{formatDateRange()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange.from || new Date()}
                selected={{
                  from: dateRange.from || undefined,
                  to: dateRange.to || undefined
                }}
                onSelect={(range) => {
                  setDateRange({
                    from: range?.from || null,
                    to: range?.to || null
                  });
                  if (range?.to) {
                    setIsOpen(false);
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Reset */}
        <div className="col-span-1 flex items-start">
          <Button 
            variant="outline"
            onClick={resetFilters}
            className="w-full"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgentFilters;
