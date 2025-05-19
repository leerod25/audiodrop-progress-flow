
import React, { useEffect } from 'react';
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
  const salaryOptions = [
    { value: "500", label: "$500/month" },
    { value: "1000", label: "$1,000/month" },
    { value: "1500", label: "$1,500/month" },
    { value: "2000", label: "$2,000/month" },
    { value: "2500", label: "$2,500/month" },
    { value: "3000", label: "$3,000/month" },
    { value: "custom", label: "Custom amount" }
  ];

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="salary_expectation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salary Expectation (monthly)</FormLabel>
            <FormControl>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value?.toString() || "500"}
                value={field.value?.toString() || "500"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select monthly salary" />
                </SelectTrigger>
                <SelectContent>
                  {salaryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Select your expected monthly compensation
            </FormDescription>
          </FormItem>
        )}
      />
      
      {/* Custom amount input that appears when "Custom amount" is selected */}
      <FormField
        control={control}
        name="custom_salary"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormControl>
              <Input
                type="number"
                placeholder="Enter custom amount in USD"
                {...field}
                className={field.value === "custom" ? "" : "opacity-0 h-0 p-0 m-0 absolute"}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default SalarySection;
