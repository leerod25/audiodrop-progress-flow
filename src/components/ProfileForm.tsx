
import { useState, useEffect } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Flag, Computer } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ProfileData = {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  description: string | null;
  city: string | null;
  country: string | null;
  gender: string | null;
  computer_skill_level: string | null;
};

interface ProfileFormProps {
  userId: string;
  onProfileUpdate?: () => void;
}

const ProfileForm = ({ userId, onProfileUpdate }: ProfileFormProps) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    email: '',
    phone: '',
    whatsapp: '',
    description: '',
    city: '',
    country: '',
    gender: '',
    computer_skill_level: '',
  });
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const { setUser } = useUserContext();
  
  // Initialize profile with user's auth email
  useEffect(() => {
    const initializeWithAuthData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email && initialLoad) {
          setProfileData(prev => ({
            ...prev,
            email: user.email
          }));
        }
      } catch (error) {
        console.error("Error getting auth user data:", error);
      }
    };
    
    if (initialLoad) {
      initializeWithAuthData();
    }
  }, [initialLoad]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // First check if profile exists
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching profile:", error);
          toast.error("Failed to load profile data.");
        }

        if (data) {
          // Profile exists, set data
          setProfileData({
            full_name: data.full_name || '',
            email: data.email || '',
            phone: data.phone || '',
            whatsapp: data.whatsapp || '',
            description: data.description || '',
            city: data.city || '',
            country: data.country || '',
            gender: data.gender || '',
            computer_skill_level: data.computer_skill_level || '',
          });
        } else {
          // Profile doesn't exist or is empty, create initial entry
          const { error: insertError } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              email: (await supabase.auth.getUser()).data.user?.email,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });
          
          if (insertError) {
            console.error("Error creating initial profile:", insertError);
          }
          
          // Set email from auth if available
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email) {
            setProfileData(prev => ({
              ...prev,
              email: user.email
            }));
          }
        }
      } catch (error) {
        console.error("Error in profile fetch/creation:", error);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfileData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: profileData.full_name,
          email: profileData.email,
          phone: profileData.phone,
          whatsapp: profileData.whatsapp,
          description: profileData.description,
          city: profileData.city,
          country: profileData.country,
          gender: profileData.gender,
          computer_skill_level: profileData.computer_skill_level,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile.");
      } else {
        toast.success("Profile updated successfully!");
        // Optimistically update the user context
        setUser(prevUser => ({
          ...prevUser,
          full_name: profileData.full_name,
          email: profileData.email,
        }));
        
        // Call the onProfileUpdate callback if provided
        if (onProfileUpdate) {
          onProfileUpdate();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Skeleton className="h-9 w-[300px]" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Skeleton className="h-9 w-[300px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Skeleton className="h-9 w-full" />
          </div>
          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <MapPin className="text-muted-foreground h-4 w-4" />
            <Label htmlFor="city">City</Label>
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="flex items-center space-x-2">
            <Flag className="text-muted-foreground h-4 w-4" />
            <Label htmlFor="country">Country</Label>
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
        <div>
          <Label htmlFor="computer_skill_level">Computer Skills</Label>
          <Skeleton className="h-9 w-[300px]" />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Skeleton className="h-[60px] w-[300px]" />
        </div>
        <Skeleton className="h-10 w-[100px]" />
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="grid gap-2">
        <Label htmlFor="full_name">Full Name <span className="text-red-500">*</span></Label>
        <Input
          type="text"
          id="full_name"
          name="full_name"
          value={profileData.full_name || ''}
          onChange={handleChange}
          placeholder="Your full name"
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={profileData.email || ''}
          onChange={handleChange}
          placeholder="Your email"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone <span className="text-red-500">*</span></Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={profileData.phone || ''}
            onChange={handleChange}
            placeholder="Your phone number"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            type="tel"
            id="whatsapp"
            name="whatsapp"
            value={profileData.whatsapp || ''}
            onChange={handleChange}
            placeholder="Your WhatsApp number"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
          <Input
            id="city"
            name="city"
            value={profileData.city || ''}
            onChange={handleChange}
            placeholder="Your city"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
          <Input
            id="country"
            name="country"
            value={profileData.country || ''}
            onChange={handleChange}
            placeholder="Your country"
            required
          />
        </div>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="computer_skill_level">Computer Skills <span className="text-red-500">*</span></Label>
        <Select 
          value={profileData.computer_skill_level || ''} 
          onValueChange={(value) => handleSelectChange('computer_skill_level', value)}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your computer skill level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={profileData.description || ''}
          onChange={handleChange}
          placeholder="A brief description about yourself"
        />
      </div>
      
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Create Profile"}
      </Button>
    </motion.form>
  );
};

export default ProfileForm;
