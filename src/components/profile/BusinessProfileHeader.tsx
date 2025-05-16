
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import TeamInviteDialog from '../auth/TeamInviteDialog';

interface BusinessProfileHeaderProps {
  profileCompleted: boolean;
}

const BusinessProfileHeader = ({ profileCompleted }: BusinessProfileHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-2xl font-bold">Business Profile</CardTitle>
    </CardHeader>
  );
};

export default BusinessProfileHeader;
