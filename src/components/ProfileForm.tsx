
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";

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
  salary_expectation: string | null;
};

interface ProfileFormProps {
  userId?: string;
  initialData?: any;
  onProfileUpdate?: () => void;
}

const ProfileForm = ({ userId, initialData, onProfileUpdate }: ProfileFormProps) => {
  const { user } = useUserContext();
  const actualUserId = userId || user?.id;
  
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: initialData?.full_name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    whatsapp: initialData?.whatsapp || '',
    description: initialData?.description || '',
    city: initialData?.city || '',
    country: initialData?.country || '',
    gender: initialData?.gender || '',
    computer_skill_level: initialData?.computer_skill_level || '',
    salary_expectation: initialData?.salary_expectation || '500',
  });
  const [loading, setLoading] = useState(!initialData);
  const [initialLoad, setInitialLoad] = useState(!initialData);
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
    
    if (initialLoad && !initialData) {
      initializeWithAuthData();
    }
  }, [initialLoad, initialData]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (initialData) {
        setProfileData({
          full_name: initialData.full_name || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          whatsapp: initialData.whatsapp || '',
          description: initialData.description || '',
          city: initialData.city || '',
          country: initialData.country || '',
          gender: initialData.gender || '',
          computer_skill_level: initialData.computer_skill_level || '',
          salary_expectation: initialData.salary_expectation || '500',
        });
        setLoading(false);
        setInitialLoad(false);
        return;
      }
      
      setLoading(true);
      try {
        // First check if profile exists
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', actualUserId)
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
            salary_expectation: data.salary_expectation || '500',
          });
        } else {
          // Profile doesn't exist or is empty, create initial entry
          const { error: insertError } = await supabase
            .from('profiles')
            .upsert({
              id: actualUserId,
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

    if (actualUserId) {
      fetchProfile();
    }
  }, [actualUserId, initialData]);

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
          id: actualUserId,
          full_name: profileData.full_name,
          email: profileData.email,
          phone: profileData.phone,
          whatsapp: profileData.whatsapp,
          description: profileData.description,
          city: profileData.city,
          country: profileData.country,
          gender: profileData.gender,
          computer_skill_level: profileData.computer_skill_level,
          salary_expectation: profileData.salary_expectation,
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

  // Define salary options
  const salaryOptions = [
    { value: "500", label: "$500 per month" },
    { value: "750", label: "$750 per month" },
    { value: "1000", label: "$1,000 per month" },
    { value: "1500", label: "$1,500 per month" },
    { value: "2000", label: "$2,000 per month" },
    { value: "2500", label: "$2,500 per month" },
    { value: "3000", label: "$3,000 per month" },
    { value: "4000", label: "$4,000 per month" },
    { value: "5000", label: "$5,000 per month" },
    { value: "custom", label: "Custom amount" }
  ];

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
      {/* Name (first) */}
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
      
      {/* Email (second) */}
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
      
      {/* Phone and WhatsApp on same line */}
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

      {/* Salary Expectation */}
      <div className="grid gap-2">
        <Label htmlFor="salary_expectation">Salary Expectation (per month) <span className="text-muted-foreground font-normal">(Confidential)</span></Label>
        <div className="flex flex-col space-y-4">
          <Select 
            value={profileData.salary_expectation || '500'} 
            onValueChange={(value) => {
              handleSelectChange('salary_expectation', value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select monthly salary expectation" />
            </SelectTrigger>
            <SelectContent>
              {salaryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {profileData.salary_expectation === 'custom' && (
            <div className="flex items-center space-x-2">
              <span className="text-lg">$</span>
              <Input
                id="custom_salary"
                name="salary_expectation"
                type="text"
                value={profileData.salary_expectation === 'custom' ? '' : profileData.salary_expectation || ''}
                onChange={handleChange}
                placeholder="Enter custom amount"
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">per month</span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          This information is confidential and will only be shared with businesses when matching you to opportunities.
        </p>
      </div>
      
      {/* Gender selection */}
      <div className="grid gap-2">
        <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="male" 
              name="gender" 
              value="male"
              checked={profileData.gender === 'male'}
              onChange={(e) => handleSelectChange('gender', e.target.value)}
              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              required
            />
            <Label htmlFor="male" className="cursor-pointer">Male</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="female" 
              name="gender" 
              value="female"
              checked={profileData.gender === 'female'}
              onChange={(e) => handleSelectChange('gender', e.target.value)}
              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="female" className="cursor-pointer">Female</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="other" 
              name="gender" 
              value="other"
              checked={profileData.gender === 'other'}
              onChange={(e) => handleSelectChange('gender', e.target.value)}
              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="other" className="cursor-pointer">Other</Label>
          </div>
        </div>
      </div>
      
      {/* Computer Skills as mandatory field */}
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
      
      {/* Description */}
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
        {loading ? "Saving..." : "Update Profile"}
      </Button>
    </motion.form>
  );
};

export default ProfileForm;
