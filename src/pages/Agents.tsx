
import React, { useState, useMemo } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { useUserContext } from '@/contexts/UserContext';
import { useUsersData } from '@/hooks/useUsersData';
import UsersList from '@/components/agents/UsersList';
import UsersError from '@/components/agents/UsersError';
import AgentFilters from '@/components/agents/AgentFilters';
import { isAfter, isBefore, isValid } from "date-fns";

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
  } = useUsersData(user);

  console.log("Agents page - total users received:", users.length);

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
      <h1 className="text-3xl font-bold mb-6">All Users ({users.length})</h1>
      
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
          ) : (
            <UsersList 
              users={filteredUsers}
              loading={loading}
              expandedUser={expandedUser}
              playingAudio={playingAudio}
              toggleUserExpand={toggleUserExpand}
              handleAudioPlay={handleAudioPlay}
              fetchAllUsers={fetchAllUsers}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Agents;
