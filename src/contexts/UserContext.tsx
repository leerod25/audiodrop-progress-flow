
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Define the shape of our context
type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userRole: "agent" | "business" | "admin" | null;
  isVerified: boolean;
};

// Create the context with a default value
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => null,
  userRole: null,
  isVerified: false,
});

// Create a provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<"agent" | "business" | "admin" | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);

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
          setUserRole(roleData.role);
        } else if (profileData && profileData.role) {
          setUserRole(profileData.role as "agent" | "business" | "admin");
        } else if (user.user_metadata?.role && 
            (user.user_metadata.role === 'agent' || user.user_metadata.role === 'business' || user.user_metadata.role === 'admin')) {
          setUserRole(user.user_metadata.role);
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
    <UserContext.Provider value={{ user, setUser, userRole, isVerified }}>
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
