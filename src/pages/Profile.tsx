
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
import AdminPromotionButton from "@/components/profile/AdminPromotionButton";

const Profile = () => {
  const { user, userRole } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
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
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  const isAgent = userRole === "agent";
  const isBusiness = userRole === "business";

  return (
    <div className="container mx-auto py-8 px-4">
      {isBusiness ? (
        <BusinessProfileHeader profile={profile} />
      ) : (
        <UserProfileHeader profile={profile} />
      )}

      <div className="mt-4">
        <AdminPromotionButton />
      </div>

      <div className="mt-8 grid gap-8 grid-cols-1">
        {isAgent && !profile?.full_name && <ProfileIncompleteAlert />}
        {isBusiness && !profile?.company_name && <BusinessProfileIncompleteAlert />}

        <Card className="p-6 shadow-sm">
          {isBusiness ? (
            <BusinessProfileForm initialData={profile} />
          ) : (
            <ProfileForm initialData={profile} />
          )}
        </Card>

        {isAgent && (
          <Card className="p-6 shadow-sm">
            <ProfessionalDetailsForm userId={user?.id} />
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
