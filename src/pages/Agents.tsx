
import React, { useState, useEffect } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import AgentCard from '@/components/agents/AgentCard';
import AgentsPagination from '@/components/agents/AgentsPagination';
import AuthAlert from '@/components/agents/AuthAlert';
import AgentsLoading from '@/components/agents/AgentsLoading';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface AudioFile {
  id: string;
  title: string;
  audio_url: string;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  audio_files: AudioFile[];
  country?: string | null;
  city?: string | null;
  gender?: string | null;
  years_experience?: string | null;
  languages?: string[] | null;
  is_available?: boolean;
}

const Agents: React.FC = () => {
  const { user, userRole } = useUserContext();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const PAGE_SIZE = 9;
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call our edge function to get all users
      const { data, error } = await supabase.functions.invoke('list-users', {
        body: { businessOnly: false }
      });
      
      if (error) {
        console.error('Error calling edge function:', error);
        setError('Failed to fetch users: ' + error.message);
        return;
      }

      // Process users and add audio data
      const processedUsers = await Promise.all((data.users || []).map(async (user: User) => {
        // Get profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('country, city, gender')
          .eq('id', user.id)
          .single();
        
        // Get audio files
        const { data: audioData } = await supabase
          .from('audio_metadata')
          .select('id, title, audio_url, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        return {
          ...user,
          country: profileData?.country || null,
          city: profileData?.city || null,
          gender: profileData?.gender || null,
          audio_files: audioData || []
        };
      }));
      
      setUsers(processedUsers);
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get avatar image based on gender
  const getAvatarImage = (gender: string | null | undefined) => {
    if (gender === 'male') {
      return '/lovable-uploads/26bccfed-a9f0-4888-8b2d-7c34fdfe37ed.png';
    } else if (gender === 'female') {
      return '/lovable-uploads/7889d5d0-d6bd-4ccf-8dbd-62fe95fc1946.png';
    }
    return null;
  };

  // Helper function to get avatar fallback text
  const getAvatarFallback = (email: string, gender: string | null | undefined) => {
    if (email && email.length > 0) {
      return email.charAt(0).toUpperCase();
    }
    return gender === 'male' ? 'M' : gender === 'female' ? 'F' : 'A';
  };

  // Calculate pagination values
  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentPageUsers = users.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Agent Profiles ({users.length})</h1>
      
      {/* Show auth alert for non-authenticated users */}
      {!user && <AuthAlert />}
      
      {/* Error state */}
      {error ? (
        <div className="text-center py-8">
          <Alert variant="destructive">
            <InfoIcon className="h-5 w-5" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      ) : loading ? (
        <AgentsLoading />
      ) : (
        <>
          {/* Display agent cards */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {currentPageUsers.map((u) => {
              // If user is a business or viewing their own profile, show audio
              const canSeeAudio = userRole === 'business' || u.id === user?.id;
              const avatarImage = getAvatarImage(u.gender);
              
              return (
                <AgentCard 
                  key={u.id}
                  user={u}
                  canSeeAudio={canSeeAudio}
                  avatarImage={avatarImage}
                  getAvatarFallback={getAvatarFallback}
                />
              );
            })}
          </div>
          
          {/* Pagination component */}
          <AgentsPagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default Agents;
