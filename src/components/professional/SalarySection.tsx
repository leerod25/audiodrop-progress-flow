
import React from 'react';
import { Control } from 'react-hook-form';

export interface SalarySectionProps {
  control: Control<any>;
}

const SalarySection: React.FC<SalarySectionProps> = () => {
  // This component is intentionally empty as salary information is confidential
  // The component structure is maintained to avoid breaking form references
  return null;
};

export default SalarySection;
