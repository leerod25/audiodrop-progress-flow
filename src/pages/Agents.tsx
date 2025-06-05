
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import Header from '@/components/landing/Header';
import AgentsHeroBanner from '@/components/agents/AgentsHeroBanner';
import AgentsList from '@/components/agents/AgentsList';
import { useInviteToken } from '@/hooks/useInviteToken';
import { useUserContext } from '@/contexts/UserContext';
import { useUserFetch } from '@/hooks/users/useUserFetch';
import InviteAccessBanner from '@/components/agents/InviteAccessBanner';
import LoginStatusBadge from '@/components/LoginStatusBadge';

const Agents = () => {
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('invite_token');
  const { inviteData, isLoading, isValid, markTokenAsUsed } = useInviteToken(inviteToken);
  const { user, userRole } = useUserContext();
  const { users, loading, error, fetchAllUsers, toggleAvailability } = useUserFetch(user);
  const [page, setPage] = useState(1);
  const usersPerPage = 12;

  // Calculate pagination
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (page - 1) * usersPerPage;
  const currentPageUsers = users.slice(startIndex, startIndex + usersPerPage);

  useEffect(() => {
    // Mark token as used when user accesses the page with a valid token
    if (isValid && inviteData && inviteToken) {
      markTokenAsUsed();
    }
  }, [isValid, inviteData, inviteToken, markTokenAsUsed]);

  const viewAgentDetails = (userId: string) => {
    // Implementation for viewing agent details
    console.log('View details for user:', userId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Container className="py-8">
        {/* Login Status Badge */}
        <div className="mb-4 flex justify-end">
          <LoginStatusBadge />
        </div>

        {/* Show invite banner for valid invitations */}
        {isValid && inviteData && (
          <InviteAccessBanner 
            email={inviteData.email} 
            expiresAt={inviteData.expires_at} 
          />
        )}
        
        <AgentsHeroBanner isLoggedIn={!!user} />
        <AgentsList
          users={users}
          loading={loading}
          error={error}
          userRole={userRole || 'guest'}
          canSeeAudio={!!user || isValid}
          currentPageUsers={currentPageUsers}
          page={page}
          totalPages={totalPages}
          fetchAllUsers={fetchAllUsers}
          setPage={setPage}
          viewAgentDetails={viewAgentDetails}
          toggleAvailability={toggleAvailability}
        />
      </Container>
    </div>
  );
};

export default Agents;
