
import React from 'react';
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { FormControl, FormItem } from "@/components/ui/form";
import { ControllerRenderProps } from "react-hook-form";
import { Heart } from "lucide-react";

interface FavoritesToggleProps {
  field: ControllerRenderProps<any, any>;
  isBusinessAccount: boolean;
}

const FavoritesToggle: React.FC<FavoritesToggleProps> = ({ field, isBusinessAccount }) => {
  if (!isBusinessAccount) return null;
  
  return (
    <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-6">
      <FormControl>
        <Toggle 
          pressed={field.value} 
          onPressedChange={field.onChange}
          aria-label="Toggle favorites only"
          className="data-[state=on]:bg-pink-100 data-[state=on]:text-pink-700"
        >
          <Heart className={field.value ? "fill-pink-500 text-pink-500" : "text-gray-500"} size={16} />
          <span className="ml-1">Favorites only</span>
        </Toggle>
      </FormControl>
    </FormItem>
  );
};

export default FavoritesToggle;
