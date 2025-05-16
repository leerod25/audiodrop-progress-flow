
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Define the shape of our context
type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userRole: "agent" | "business" | null;
};

// Create the context with a default value
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => null,
  userRole: null,
});

// Create a provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<"agent" | "business" | null>(null);

  // Fetch user role when user changes
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole(null);
        return;
      }

      try {
        // First try to get from user_roles table
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user role:', error);
        }

        if (data) {
          setUserRole(data.role as "agent" | "business");
          return;
        }

        // If not in table, try to get from user metadata
        const metadata = user.user_metadata;
        if (metadata && metadata.role && (metadata.role === 'agent' || metadata.role === 'business')) {
          setUserRole(metadata.role);
          // Also save to database for future use
          await supabase
            .from('user_roles')
            .upsert({ user_id: user.id, role: metadata.role }, { onConflict: 'user_id' });
        } else {
          // Default to agent if not specified
          setUserRole("agent");
        }
      } catch (err) {
        console.error('Error in role handling:', err);
        setUserRole("agent"); // Default fallback
      }
    };

    fetchUserRole();
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, userRole }}>
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
