
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Mic } from 'lucide-react';

interface UserProfileHeaderProps {
  profileCompleted: boolean;
}

const UserProfileHeader = ({ profileCompleted }: UserProfileHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-2xl font-bold">Create Profile</CardTitle>
      {profileCompleted && (
        <Button asChild variant="outline" size="sm" className="transition-colors duration-200 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-purple-300">
          <Link to="/upload">
            <Mic className="mr-2 h-4 w-4" />
            Record New Audio
          </Link>
        </Button>
      )}
    </CardHeader>
  );
};

export default UserProfileHeader;
