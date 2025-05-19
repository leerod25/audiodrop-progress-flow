
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

// This component has been deprecated as salary information is now handled in the ProfileForm
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
            This field has been moved to the main profile section
          </FormDescription>
        </FormItem>
      )}
    />
  );
};

export default SalarySection;
