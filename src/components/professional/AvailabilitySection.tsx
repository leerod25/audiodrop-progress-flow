
import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel,
  FormDescription
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface AvailabilitySectionProps {
  availability: string[];
  onAvailabilityChange: (availability: string[]) => void;
}

const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({
  availability,
  onAvailabilityChange
}) => {
  const availabilityOptions = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'weekends', label: 'Weekends' },
    { value: 'evenings', label: 'Evenings' },
    { value: 'overnight', label: 'Overnight' }
  ];

  const handleAvailabilityChange = (checked: boolean, value: string) => {
    if (checked) {
      onAvailabilityChange([...availability, value]);
    } else {
      onAvailabilityChange(availability.filter(item => item !== value));
    }
  };

  return (
    <FormField
      name="availability"
      render={() => (
        <FormItem className="space-y-1">
          <FormLabel>Availability</FormLabel>
          <FormDescription>
            Select all the time periods you're available to work
          </FormDescription>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {availabilityOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`availability-${option.value}`} 
                  checked={availability.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleAvailabilityChange(checked as boolean, option.value)
                  }
                />
                <Label htmlFor={`availability-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </FormItem>
      )}
    />
  );
};

export default AvailabilitySection;
