
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DollarSign } from 'lucide-react';

export interface SalarySectionProps {
  control: Control<any>;
}

const SalarySection: React.FC<SalarySectionProps> = ({ control }) => {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Salary Expectations</h3>
      <FormField
        control={control}
        name="salary_expectation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monthly Salary (USD)</FormLabel>
            <FormControl>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-5 w-5 text-gray-500" />
                <Input 
                  type="number" 
                  placeholder="500" 
                  className="pl-9" 
                  {...field} 
                  value={field.value || ''} 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SalarySection;
