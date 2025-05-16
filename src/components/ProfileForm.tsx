
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";

type ProfileData = {
  id: string;
  full_name: string | null;
  description: string | null;
  email: string | null;
  phone: string | null;
  gender: string | null;
  whatsapp: string | null;
};

interface ProfileFormProps {
  userId: string;
}

const ProfileForm = ({ userId }: ProfileFormProps) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast.error('Could not load profile information');
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error('Unexpected error in fetchProfile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (profile) {
      setProfile({
        ...profile,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          description: profile.description,
          email: profile.email,
          phone: profile.phone,
          gender: profile.gender,
          whatsapp: profile.whatsapp,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
      } else {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Unexpected error in handleSubmit:', err);
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Profile Information</h2>
        {!isEditing ? (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Button 
              type="button" 
              onClick={() => setIsEditing(true)}
              variant="outline" 
              className="transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              Edit Profile
            </Button>
          </motion.div>
        ) : null}
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            value={profile?.full_name || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="transition-colors duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={profile?.email || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="transition-colors duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={profile?.phone || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className="transition-colors duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />
          </div>

          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              name="whatsapp"
              value={profile?.whatsapp || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className="transition-colors duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="gender">Gender</Label>
          <select
            id="gender"
            name="gender"
            value={profile?.gender || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full rounded-md border border-input bg-background px-3 py-2 transition-colors duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <Label htmlFor="description">About Me</Label>
          <Textarea
            id="description"
            name="description"
            value={profile?.description || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="min-h-[100px] transition-colors duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {isEditing && (
          <div className="flex gap-2 pt-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex-1"
            >
              <Button 
                type="submit" 
                disabled={saving}
                className="w-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Button 
                type="button" 
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                Cancel
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;
