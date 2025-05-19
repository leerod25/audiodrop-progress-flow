
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileForm from '@/components/ProfileForm';

interface ProfileFormProps {
  profile: any;
  loading: boolean;
  setProfile: (updatedProfile: any) => void;
  updateProfile: (data: any) => Promise<boolean>;
  userRole?: string | null;
}

const ProfileFormWrapper: React.FC<ProfileFormProps> = ({
  profile,
  loading,
  setProfile,
  updateProfile,
  userRole
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Complete your profile to help others understand who you are
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileForm 
          initialData={profile} 
          onProfileUpdate={(updatedProfile) => {
            setProfile(updatedProfile);
          }}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileFormWrapper;
