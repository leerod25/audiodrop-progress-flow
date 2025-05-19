
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Define the shape of our context
type UserRole = "agent" | "business" | "admin" | null;

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userRole: UserRole;
  isVerified: boolean;
  refreshUserProfile: () => Promise<void>;
};

// Create the context with a default value
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => null,
  userRole: null,
  isVerified: false,
  refreshUserProfile: async () => {},
});

// Create a provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const refreshUserProfile = async () => {
    if (!user) return;
    
    try {
      // Refresh profile data for potential updates
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_verified')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error refreshing profile:', profileError);
      }

      // Update verification status from profile
      if (profileData) {
        setIsVerified(profileData.is_verified || false);
      }
    } catch (err) {
      console.error('Error refreshing user profile:', err);
    }
  };

  // Fetch user role when user changes
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole(null);
        setIsVerified(false);
        return;
      }

      try {
        // First try to get from user_roles table for auth role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        // Then get profile data for business verification status
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role, is_verified')
          .eq('id', user.id)
          .single();

        if (roleError && roleError.code !== 'PGRST116') {
          console.error('Error fetching user role:', roleError);
        }

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
        }

        // Set user role with priority to auth role table
        if (roleData && (roleData.role === 'agent' || roleData.role === 'business' || roleData.role === 'admin')) {
          setUserRole(roleData.role as UserRole);
        } else if (profileData && profileData.role) {
          setUserRole(profileData.role as UserRole);
        } else if (user.user_metadata?.role && 
            (user.user_metadata.role === 'agent' || user.user_metadata.role === 'business' || user.user_metadata.role === 'admin')) {
          setUserRole(user.user_metadata.role as UserRole);
        } else {
          // Default to agent if not specified
          setUserRole("agent");
        }

        // Set verification status from profile
        setIsVerified(profileData?.is_verified || false);

      } catch (err) {
        console.error('Error in role handling:', err);
        setUserRole("agent"); // Default fallback
        setIsVerified(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, userRole, isVerified, refreshUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the context
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
