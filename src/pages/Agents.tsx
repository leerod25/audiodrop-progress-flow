
import React, { useState, useMemo } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { useUserContext } from '@/contexts/UserContext';
import { useUsersData } from '@/hooks/useUsersData';
import UsersList from '@/components/agents/UsersList';
import UsersError from '@/components/agents/UsersError';
import AgentFilters from '@/components/agents/AgentFilters';
import { isAfter, isBefore, isValid } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Use the same User interface as in UsersList
interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
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

interface AudioFile {
  id: string;
  title: string;
  audio_url: string;
  created_at: string;
}

const Agents: React.FC = () => {
  const { user } = useUserContext();
  const [emailFilter, setEmailFilter] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null
  });
  
  const {
    users,
    loading,
    error,
    expandedUser,
    playingAudio,
    fetchAllUsers,
    toggleUserExpand,
    handleAudioPlay,
    toggleAvailability,
  } = useUsersData(user);

  console.log("Agents page - total agent profiles received:", users.length);

  // Reset filters function
  const resetFilters = () => {
    setEmailFilter('');
    setDateRange({ from: null, to: null });
  };

  // Apply filters to users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Email filter
      const emailMatch = !emailFilter || 
        (user.email?.toLowerCase().includes(emailFilter.toLowerCase()) ?? false);
      
      // Date filter
      let dateMatch = true;
      
      if (dateRange.from && isValid(dateRange.from)) {
        const userDate = new Date(user.created_at);
        dateMatch = dateMatch && isAfter(userDate, dateRange.from);
      }
      
      if (dateRange.to && isValid(dateRange.to)) {
        const userDate = new Date(user.created_at);
        dateMatch = dateMatch && isBefore(userDate, new Date(dateRange.to.setHours(23, 59, 59, 999)));
      }
      
      return emailMatch && dateMatch;
    });
  }, [users, emailFilter, dateRange]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Agent Profiles ({users.length})</h1>
      
      {!user && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <InfoIcon className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800">Limited Preview Mode</AlertTitle>
          <AlertDescription className="text-amber-700">
            You're viewing agent profiles in preview mode. To access audio samples and contact information, please register or log in.
            <div className="mt-3 flex flex-wrap gap-3">
              <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700">
                <Link to="/auth">Log In</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-100">
                <Link to="/auth?tab=signup">Sign Up</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {error ? (
        <UsersError error={error} isLoggedIn={!!user} />
      ) : (
        <>
          <AgentFilters
            emailFilter={emailFilter}
            setEmailFilter={setEmailFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            resetFilters={resetFilters}
          />
          
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : filteredUsers.length > 0 ? (
            <UsersList 
              users={filteredUsers}
              loading={loading}
              expandedUser={expandedUser}
              playingAudio={playingAudio}
              toggleUserExpand={toggleUserExpand}
              handleAudioPlay={handleAudioPlay}
              fetchAllUsers={fetchAllUsers}
              showLoginPrompt={!user}
              toggleAvailability={user ? toggleAvailability : undefined}
            />
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">No agent profiles match your filters.</p>
                <Button variant="outline" onClick={resetFilters} className="mt-4">
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Agents;
