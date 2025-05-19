import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel,
  FormDescription,
  FormControl
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Control } from 'react-hook-form';

export interface SalarySectionProps {
  control: Control<any>;
}

const SalarySection: React.FC<SalarySectionProps> = ({
  control
}) => {
  // Keeping the component structure intact but removing the actual UI elements
  // This way any forms that use it won't break, but the salary information won't be shown
  return (
    <div className="space-y-4">
      {/* Removed the salary input fields as requested */}
    </div>
  );
};

export default SalarySection;
