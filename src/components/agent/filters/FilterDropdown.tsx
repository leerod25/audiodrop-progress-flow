
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormControl, FormItem } from "@/components/ui/form";
import { ControllerRenderProps } from "react-hook-form";

interface FilterDropdownProps {
  label: string;
  field: ControllerRenderProps<any, any>;
  options: string[];
  placeholder: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  field,
  options,
  placeholder
}) => {
  return (
    <FormItem>
      <Label>{label}</Label>
      <FormControl>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {field.value || placeholder}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => field.onChange("")}>
              Any
            </DropdownMenuItem>
            {options.map((option) => (
              <DropdownMenuItem 
                key={option} 
                onClick={() => field.onChange(option)}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </FormControl>
    </FormItem>
  );
};

export default FilterDropdown;
