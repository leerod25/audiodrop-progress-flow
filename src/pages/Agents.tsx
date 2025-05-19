
import React, { useState, useEffect } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import AgentCard from '@/components/agents/AgentCard';
import AgentsPagination from '@/components/agents/AgentsPagination';
import AuthAlert from '@/components/agents/AuthAlert';
import AgentsLoading from '@/components/agents/AgentsLoading';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, ShieldAlert, ShieldCheck } from "lucide-react";
import { Navigate } from 'react-router-dom';
import { useUsersData } from '@/hooks/useUsersData';
import UsersList from '@/components/agents/UsersList';
import { toast } from "sonner";

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
  role?: string;
  is_verified?: boolean;
}

const Agents: React.FC = () => {
  const { user, userRole } = useUserContext();
  const { 
    users, 
    loading, 
    error, 
    expandedUser, 
    playingAudio, 
    fetchAllUsers, 
    toggleUserExpand, 
    handleAudioPlay,
    toggleAvailability 
  } = useUsersData(user);
  
  const [forbidden, setForbidden] = useState(false);
  
  // Pagination state
  const PAGE_SIZE = 9;
  const [page, setPage] = useState(1);

  // Calculate pagination values
  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentPageUsers = users.slice(startIndex, startIndex + PAGE_SIZE);
  
  // Force refresh on initial load
  useEffect(() => {
    console.log("Agents component mounted, userRole:", userRole);
    fetchAllUsers().catch(err => {
      console.error("Failed to fetch users on initial load:", err);
      toast.error("Failed to load agent profiles");
    });
  }, []);

  // Redirect if forbidden
  if (forbidden) {
    return <Navigate to="/" replace />;
  }

  // Admin Navigation to Business Approvals
  const renderAdminActions = () => {
    if (userRole === 'admin') {
      return (
        <div className="mb-4 flex justify-end">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <a href="/admin/business-approvals">
              <ShieldCheck className="h-4 w-4" />
              Business Approvals
            </a>
          </Button>
        </div>
      );
    }
    return null;
  };

  // If the user is an admin, show the list view with availability toggle
  if (userRole === 'admin') {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Agent Profiles ({users.length})</h1>
        
        {renderAdminActions()}
        
        {error ? (
          <div className="text-center py-8">
            <Alert variant="destructive">
              <InfoIcon className="h-5 w-5" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button 
              onClick={() => fetchAllUsers()} 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <UsersList
            users={users}
            loading={loading}
            expandedUser={expandedUser}
            playingAudio={playingAudio}
            toggleUserExpand={toggleUserExpand}
            handleAudioPlay={handleAudioPlay}
            fetchAllUsers={fetchAllUsers}
            toggleAvailability={toggleAvailability}
          />
        )}
      </div>
    );
  }

  // Regular non-admin view (cards)
  console.log("Rendering regular view with userRole:", userRole, "and users:", users.length);
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Agent Profiles ({users.length})</h1>
      
      {/* Admin actions */}
      {renderAdminActions()}
      
      {/* Show auth alert for non-authenticated users */}
      {!user && <AuthAlert />}
      
      {/* Debug info */}
      <div className="text-sm text-gray-500 mb-4">
        Role: {userRole || 'Unknown'} | User ID: {user?.id?.substring(0, 8) || 'Not logged in'}
      </div>
      
      {/* Error state */}
      {error ? (
        <div className="text-center py-8">
          <Alert variant="destructive">
            <InfoIcon className="h-5 w-5" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            onClick={() => fetchAllUsers()} 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      ) : loading ? (
        <AgentsLoading />
      ) : ((userRole !== 'business' && userRole !== 'admin') && users.length === 0) ? (
        <Alert className="my-4">
          <ShieldAlert className="h-5 w-5" />
          <AlertDescription>
            You need a business account to view all agents. You can only see your own profile.
          </AlertDescription>
        </Alert>
      ) : users.length === 0 ? (
        <Alert className="my-4">
          <InfoIcon className="h-5 w-5" />
          <AlertDescription>
            No agent profiles found. Please try refreshing or check back later.
          </AlertDescription>
          <Button 
            onClick={() => fetchAllUsers()} 
            className="mt-4"
          >
            Refresh
          </Button>
        </Alert>
      ) : (
        <>
          {/* Display agent cards */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {currentPageUsers.map((u) => {
              // If user is a business or viewing their own profile, show audio
              const canSeeAudio = userRole === 'business' || userRole === 'admin' || u.id === user?.id;
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
          {users.length > 0 && (
            <AgentsPagination 
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );

  // Helper function to get avatar image based on gender
  function getAvatarImage(gender: string | null | undefined) {
    // Default to male avatar if gender is not specified
    if (!gender) {
      return '/lovable-uploads/26bccfed-a9f0-4888-8b2d-7c34fdfe37ed.png';
    }
    
    if (gender === 'male' || gender === 'Male') {
      return '/lovable-uploads/26bccfed-a9f0-4888-8b2d-7c34fdfe37ed.png';
    } else if (gender === 'female' || gender === 'Female') {
      return '/lovable-uploads/7889d5d0-d6bd-4ccf-8dbd-62fe95fc1946.png';
    }
    // Default to male if gender doesn't match known values
    return '/lovable-uploads/26bccfed-a9f0-4888-8b2d-7c34fdfe37ed.png';
  }

  // Helper function to get avatar fallback text
  function getAvatarFallback(email: string, gender: string | null | undefined) {
    if (email && email.length > 0) {
      return email.charAt(0).toUpperCase();
    }
    return gender === 'female' || gender === 'Female' ? 'F' : 'M'; // Default to M if not female
  }
};

export default Agents;
