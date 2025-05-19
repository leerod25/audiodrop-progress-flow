
import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface SalarySectionProps {
  salaryExpectation: string;
  onSalaryExpectationChange: (salary: string) => void;
}

const SalarySection: React.FC<SalarySectionProps> = ({
  salaryExpectation,
  onSalaryExpectationChange
}) => {
  return (
    <FormField
      name="salaryExpectation"
      render={() => (
        <FormItem className="space-y-1">
          <FormLabel>Salary Expectation</FormLabel>
          <FormDescription>
            What is your expected annual salary (USD)?
          </FormDescription>
          <div className="flex items-center space-x-2">
            <Label htmlFor="salary" className="text-lg">$</Label>
            <Input
              id="salary"
              type="text"
              placeholder="e.g. 45,000"
              value={salaryExpectation}
              onChange={(e) => onSalaryExpectationChange(e.target.value)}
              className="flex-1"
            />
          </div>
          <FormDescription>
            You can enter a specific amount or a range (e.g. "45,000-55,000")
          </FormDescription>
        </FormItem>
      )}
    />
  );
};

export default SalarySection;
