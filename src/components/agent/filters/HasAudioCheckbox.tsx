
import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormItem } from "@/components/ui/form";
import { ControllerRenderProps } from "react-hook-form";

interface HasAudioCheckboxProps {
  field: ControllerRenderProps<any, any>;
}

const HasAudioCheckbox: React.FC<HasAudioCheckboxProps> = ({ field }) => {
  return (
    <FormItem className="flex flex-row items-end space-x-3 space-y-0 pt-6">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <Label>Has Audio Only</Label>
    </FormItem>
  );
};

export default HasAudioCheckbox;
