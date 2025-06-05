
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import Header from '@/components/landing/Header';
import AgentsHeroBanner from '@/components/agents/AgentsHeroBanner';
import AgentsList from '@/components/agents/AgentsList';
import { useInviteToken } from '@/hooks/useInviteToken';
import InviteAccessBanner from '@/components/agents/InviteAccessBanner';

const Agents = () => {
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('invite_token');
  const { inviteData, isLoading, isValid, markTokenAsUsed } = useInviteToken(inviteToken);

  useEffect(() => {
    // Mark token as used when user accesses the page with a valid token
    if (isValid && inviteData && inviteToken) {
      markTokenAsUsed();
    }
  }, [isValid, inviteData, inviteToken, markTokenAsUsed]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Container className="py-8">
        {/* Show invite banner for valid invitations */}
        {isValid && inviteData && (
          <InviteAccessBanner 
            email={inviteData.email} 
            expiresAt={inviteData.expires_at} 
          />
        )}
        
        <AgentsHeroBanner />
        <AgentsList />
      </Container>
    </div>
  );
};

export default Agents;
