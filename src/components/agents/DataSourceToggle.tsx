
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DataSourceToggleProps {
  useFakeData: boolean;
  onToggleDataSource: () => void;
}

const DataSourceToggle: React.FC<DataSourceToggleProps> = ({ 
  useFakeData, 
  onToggleDataSource 
}) => {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="fake-data-toggle" className="text-sm font-medium">Use Fake Data</Label>
      <Switch
        id="fake-data-toggle"
        checked={useFakeData}
        onCheckedChange={onToggleDataSource}
      />
    </div>
  );
};

export default DataSourceToggle;
