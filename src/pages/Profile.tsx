
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import ProfileForm from "@/components/ProfileForm";
import ProfileIncompleteAlert from "@/components/profile/ProfileIncompleteAlert";
import BusinessProfileForm from "@/components/BusinessProfileForm";
import BusinessProfileIncompleteAlert from "@/components/profile/BusinessProfileIncompleteAlert";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import { useNavigate } from "react-router-dom";
import ProfessionalDetailsForm from "@/components/ProfessionalDetailsForm";
import ProfileAudioList from "@/components/profile/ProfileAudioList";
import UserProfileHeader from "@/components/profile/UserProfileHeader";
import BusinessProfileHeader from "@/components/profile/BusinessProfileHeader";
import { toast } from "sonner";

const Profile = () => {
  const { user, userRole } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [professionalDetails, setProfessionalDetails] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/auth");
      }
    };

    checkSession();
  }, [navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setProfile(data);

        // Also fetch professional details if user is an agent
        if (userRole === "agent") {
          const { data: profDetails, error: profError } = await supabase
            .from("professional_details")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();
            
          if (!profError) {
            setProfessionalDetails(profDetails || {});
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, userRole]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  const isAgent = userRole === "agent";
  const isBusiness = userRole === "business";
  
  // Determine profile completion status
  const isProfileComplete = isAgent 
    ? Boolean(profile?.full_name && profile?.email && profile?.phone)
    : Boolean(profile?.company_name || profile?.business_name);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile({...profile, ...updatedProfile});
    toast.success("Profile information updated successfully!");
  };
  
  const handleProfessionalDetailsUpdate = (updatedDetails) => {
    setProfessionalDetails({...professionalDetails, ...updatedDetails});
    toast.success("Professional details updated successfully!");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {isBusiness ? (
        <BusinessProfileHeader profileCompleted={isProfileComplete} profile={profile} />
      ) : (
        <UserProfileHeader profileCompleted={isProfileComplete} profile={profile} />
      )}

      <div className="mt-8 grid gap-8 grid-cols-1">
        {isAgent && !profile?.full_name && <ProfileIncompleteAlert isVisible={true} />}
        {isBusiness && !profile?.company_name && !profile?.business_name && <BusinessProfileIncompleteAlert isVisible={true} />}

        <Card className="p-6 shadow-sm border-blue-200 border-2">
          <h2 className="text-xl font-semibold mb-2">Private Information</h2>
          <p className="text-sm text-gray-500 mb-4">This information is only visible to you and administrators</p>
          {isBusiness ? (
            <BusinessProfileForm userId={user?.id} initialData={profile} onProfileUpdate={handleProfileUpdate} />
          ) : (
            <ProfileForm userId={user?.id} initialData={profile} onProfileUpdate={handleProfileUpdate} />
          )}
        </Card>

        {isAgent && user?.id && (
          <Card className="p-6 shadow-sm border-green-200 border-2">
            <h2 className="text-xl font-semibold mb-2">Public Professional Details</h2>
            <p className="text-sm text-gray-500 mb-4">This information is visible to everyone</p>
            <ProfessionalDetailsForm 
              userId={user?.id} 
              initialData={professionalDetails} 
              onDetailsUpdate={handleProfessionalDetailsUpdate}
            />
          </Card>
        )}

        {isAgent && (
          <Card className="p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Your Audio Samples</h2>
            <ProfileAudioList userId={user?.id} />
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
