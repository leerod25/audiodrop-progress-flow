
import React from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { useUsersData } from '@/hooks/useUsersData';
import AgentDetailCard from '@/components/agent/AgentDetailCard';

const AgentPreview: React.FC = () => {
  const { user, userRole } = useUserContext();
  // pull *all* non-business users + their audio via your Edge Function
  const {
    users: agents,
    loading,
    error,
  } = useUsersData(user);

  if (loading) return <p>Loading agents…</p>;
  if (error)   return <p style={{color:'red'}}>Error: {error}</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">All Agents ({agents.length})</h1>
      {agents.map(a => (
        <AgentDetailCard
          key={a.id}
          agent={{
            ...a,                               // include audio_files or audioUrls
            has_audio: a.audio_files?.length > 0 || false, // Add the missing has_audio property
            audioUrls: a.audio_files?.map((file, idx) => ({
              id: file.id || String(idx),
              title: file.title || 'Recording',
              url: file.audio_url,
              updated_at: file.created_at || ''
            })) || [],     
            computer_skill_level: a.years_experience?.toString() || null
          }}
          isBusinessAccount={userRole === 'business'}
          formatUserId={(id) => id.substring(0, 8) + '...'}
          toggleFavorite={() => console.log('Toggle favorite not implemented')}
        />
      ))}
    </div>
  );
};

export default AgentPreview;
