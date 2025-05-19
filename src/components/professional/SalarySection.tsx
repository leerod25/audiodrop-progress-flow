
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";

interface SalarySectionProps {
  salary: number | null;
  onChange: (value: number | null) => void;
}

const SalarySection = ({ salary, onChange }: SalarySectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <DollarSign className="h-4 w-4 text-muted-foreground" />
        <Label className="text-lg font-medium">Desired Monthly Salary (USD)</Label>
      </div>
      <div className="max-w-xs">
        <Input
          type="number"
          id="salary_expectation"
          placeholder="e.g., 3000"
          value={salary || 500}
          onChange={(e) => {
            const value = e.target.value ? Number(e.target.value) : 500; // Default to 500 if empty
            onChange(value);
          }}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default SalarySection;
