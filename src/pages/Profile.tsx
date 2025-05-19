
import React, { useState, useEffect } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import ProfileForm from '@/components/profile/ProfileForm';
import SubscriptionInfo from '@/components/profile/SubscriptionInfo';
import SecuritySettings from '@/components/profile/SecuritySettings';
import NotificationSettings from '@/components/profile/NotificationSettings';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

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
    updateNotificationSettings
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
          
          <TabsContent value="subscription" className="space-y-4">
            <SubscriptionInfo 
              subscription={profile?.subscription} 
              userRole={userRole}
            />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <SecuritySettings 
              changePassword={changePassword}
            />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
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
