
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
import { MapPin, Flag, Building } from 'lucide-react';
import TeamInviteDialog from '@/components/auth/TeamInviteDialog';

type BusinessProfileData = {
  business_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  industry: string | null;
  city: string | null;
  country: string | null;
};

interface BusinessProfileFormProps {
  userId: string;
  onProfileUpdate?: () => void;
}

const BusinessProfileForm = ({ userId, onProfileUpdate }: BusinessProfileFormProps) => {
  const [profileData, setProfileData] = useState<BusinessProfileData>({
    business_name: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    industry: '',
    city: '',
    country: ''
  });
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
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
    const fetchBusinessProfile = async () => {
      setLoading(true);
      try {
        // First check if business profile exists
        // Using 'any' as a temporary workaround until types are regenerated
        const { data, error } = await supabase
          .from('business_profiles' as any)
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching business profile:", error);
          toast.error("Failed to load business profile data.");
        }

        if (data) {
          // Profile exists, set data
          setProfileData({
            business_name: data.business_name || '',
            email: data.email || '',
            phone: data.phone || '',
            website: data.website || '',
            description: data.description || '',
            industry: data.industry || '',
            city: data.city || '',
            country: data.country || '',
          });
        } else {
          // Business profile doesn't exist or is empty, create initial entry
          const { error: insertError } = await supabase
            .from('business_profiles' as any)
            .upsert({
              id: userId,
              email: (await supabase.auth.getUser()).data.user?.email,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });
          
          if (insertError) {
            console.error("Error creating initial business profile:", insertError);
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
        console.error("Error in business profile fetch/creation:", error);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    if (userId) {
      fetchBusinessProfile();
    }
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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
        .from('business_profiles' as any)
        .upsert({
          id: userId,
          business_name: profileData.business_name,
          email: profileData.email,
          phone: profileData.phone,
          website: profileData.website,
          description: profileData.description,
          industry: profileData.industry,
          city: profileData.city,
          country: profileData.country,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (error) {
        console.error("Error updating business profile:", error);
        toast.error("Failed to update business profile.");
      } else {
        toast.success("Business profile updated successfully!");
        
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
          <Label htmlFor="business_name">Business Name</Label>
          <Skeleton className="h-9 w-full" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Skeleton className="h-9 w-full" />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Skeleton className="h-9 w-full" />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Skeleton className="h-9 w-full" />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Skeleton className="h-[60px] w-full" />
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Business Information</h3>
        <Button 
          type="button"
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => setIsInviteDialogOpen(true)}
        >
          <span>Invite Team Member</span>
        </Button>
        <TeamInviteDialog isOpen={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen} />
      </div>

      {/* Business Name */}
      <div className="grid gap-2">
        <Label htmlFor="business_name">Business Name <span className="text-red-500">*</span></Label>
        <Input
          type="text"
          id="business_name"
          name="business_name"
          value={profileData.business_name || ''}
          onChange={handleChange}
          placeholder="Your business name"
          required
        />
      </div>
      
      {/* Email */}
      <div className="grid gap-2">
        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={profileData.email || ''}
          onChange={handleChange}
          placeholder="Your business email"
          required
        />
      </div>
      
      {/* Phone and Website on same line */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone <span className="text-red-500">*</span></Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={profileData.phone || ''}
            onChange={handleChange}
            placeholder="Your business phone number"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="website">Website</Label>
          <Input
            type="text"
            id="website"
            name="website"
            value={profileData.website || ''}
            onChange={handleChange}
            placeholder="Your business website"
          />
        </div>
      </div>
      
      {/* Country and City on same line */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
      
      {/* Industry */}
      <div className="grid gap-2">
        <Label htmlFor="industry">Industry <span className="text-red-500">*</span></Label>
        <Input
          id="industry"
          name="industry"
          value={profileData.industry || ''}
          onChange={handleChange}
          placeholder="Your business industry"
          required
        />
      </div>
      
      {/* Description */}
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={profileData.description || ''}
          onChange={handleChange}
          placeholder="A brief description of your business"
          rows={4}
        />
      </div>
      
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Update Business Profile"}
      </Button>
    </motion.form>
  );
};

export default BusinessProfileForm;
