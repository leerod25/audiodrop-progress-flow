
import React, { useState, useEffect } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfessionalDetailsForm from '@/components/professional/ProfessionalDetailsForm';
import SubscriptionInfo from '@/components/profile/SubscriptionInfo';
import SecuritySettings from '@/components/profile/SecuritySettings';
import NotificationSettings from '@/components/profile/NotificationSettings';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { useToast } from '@/components/ui/use-toast';

const Profile = () => {
  const { user, userRole } = useUserContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  
  const { 
    profile, 
    loading, 
    error, 
    setProfile,
    updateProfile,
    changePassword,
    updateNotificationSettings,
    professionalDetails,
    updateProfessionalDetails,
    loadingProfessional
  } = useProfile();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <Container className="py-8">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <ProfileForm 
              profile={profile} 
              loading={loading}
              setProfile={(updatedProfile) => setProfile(updatedProfile)}
              updateProfile={updateProfile}
              userRole={userRole}
            />
          </TabsContent>
          
          <TabsContent value="professional" className="space-y-4">
            {user && (
              <Card>
                <CardContent className="pt-6">
                  <ProfessionalDetailsForm
                    userId={user.id}
                    initialData={professionalDetails}
                    onDetailsUpdate={updateProfessionalDetails}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <SecuritySettings 
              changePassword={changePassword}
            />
            <NotificationSettings 
              settings={profile?.notification_settings}
              updateSettings={updateNotificationSettings}
            />
          </TabsContent>
        </Tabs>
      </Container>
      
      <Footer />
    </div>
  );
};

export default Profile;
