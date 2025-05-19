
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock } from "lucide-react";

interface AvailabilitySectionProps {
  availability: string[];
  onChange: (availability: string[]) => void;
}

const AvailabilitySection = ({ availability, onChange }: AvailabilitySectionProps) => {
  const availabilityOptions = [
    { id: 'morning', label: 'Morning (6am-12pm)' },
    { id: 'afternoon', label: 'Afternoon (12pm-6pm)' },
    { id: 'night', label: 'Night (6pm-12am)' },
    { id: 'weekends', label: 'Weekends' },
    { id: 'part-time', label: 'Part-time' },
    { id: 'full-time', label: 'Full-time' }
  ];

  const handleCheckboxChange = (option: string, checked: boolean) => {
    const newAvailability = checked 
      ? [...availability, option] 
      : availability.filter(time => time !== option);
    onChange(newAvailability);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <Label className="text-lg font-medium">Availability</Label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {availabilityOptions.map(option => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox 
              id={option.id} 
              checked={availability.includes(option.label)} 
              onCheckedChange={(checked) => handleCheckboxChange(option.label, !!checked)}
            />
            <Label htmlFor={option.id}>{option.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilitySection;
