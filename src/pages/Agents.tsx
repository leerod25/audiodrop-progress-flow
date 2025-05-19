
import React, { useState, useEffect } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { Button } from "@/components/ui/button";
import AuthAlert from '@/components/agents/AuthAlert';
import { Navigate } from 'react-router-dom';
import { useUsersData } from '@/hooks/useUsersData';
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import AgentsList from '@/components/agents/AgentsList';
import AdminUsersList from '@/components/agents/AdminUsersList';
import AgentDetailsDialog from '@/components/agents/AgentDetailsDialog';

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
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  
  // Pagination state
  const PAGE_SIZE = 9;
  const [page, setPage] = useState(1);

  // Team state: store IDs of users added to team
  const [team, setTeam] = useState<string[]>([]);

  // Calculate pagination values
  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentPageUsers = users.slice(startIndex, startIndex + PAGE_SIZE);
  
  // Toggle team member function
  const toggleTeamMember = (id: string) => {
    setTeam(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  // Force refresh on initial load
  useEffect(() => {
    console.log("Agents component mounted, userRole:", userRole);
    fetchAllUsers().catch(err => {
      console.error("Failed to fetch users on initial load:", err);
      toast.error("Failed to load agent profiles");
    });
  }, []);

  // Function to view agent's professional details
  const viewAgentDetails = (userId: string) => {
    setSelectedAgentId(userId);
  };

  // Function to close the agent details dialog
  const closeAgentDetails = () => {
    setSelectedAgentId(null);
  };

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
        <div className="flex justify-between items-center mb-6">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <a href="/">
              <ArrowLeft className="h-4 w-4" />
              Return to Dashboard
            </a>
          </Button>
          <h1 className="text-3xl font-bold">Agent Profiles ({users.length})</h1>
        </div>
        
        {renderAdminActions()}
        
        <AdminUsersList
          users={users}
          loading={loading}
          error={error}
          expandedUser={expandedUser}
          playingAudio={playingAudio}
          toggleUserExpand={toggleUserExpand}
          handleAudioPlay={handleAudioPlay}
          fetchAllUsers={fetchAllUsers}
          toggleAvailability={toggleAvailability}
        />
      </div>
    );
  }

  // Regular business user view (cards)
  console.log("Rendering regular view with userRole:", userRole, "and users:", users.length);
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <Button asChild variant="outline" className="flex items-center gap-2">
          <a href="/">
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </a>
        </Button>
        <h1 className="text-3xl font-bold">Agent Profiles ({users.length})</h1>
      </div>
      
      {/* Admin actions */}
      {renderAdminActions()}
      
      {/* Show auth alert for non-authenticated users */}
      {!user && <AuthAlert />}
      
      {/* Debug info */}
      <div className="text-sm text-gray-500 mb-4">
        Role: {userRole || 'Unknown'} | User ID: {user?.id?.substring(0, 8) || 'Not logged in'}
      </div>
      
      {/* Team Members Count */}
      {team.length > 0 && (
        <p className="mb-4 font-medium">Team Members: {team.length}</p>
      )}
      
      {/* Agent List Component */}
      <AgentsList
        users={users}
        loading={loading}
        error={error}
        userRole={userRole || ''}
        canSeeAudio={Boolean(userRole === 'business' || userRole === 'admin')}
        currentPageUsers={currentPageUsers}
        page={page}
        totalPages={totalPages}
        fetchAllUsers={fetchAllUsers}
        setPage={setPage}
        viewAgentDetails={viewAgentDetails}
        toggleAvailability={toggleAvailability}
        team={team}
        toggleTeamMember={toggleTeamMember}
      />

      {/* Team Members Section */}
      {team.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">My Team Members</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {team.map(id => {
              const member = users.find(u => u.id === id);
              if (!member) return null;
              return (
                <div key={id} className="p-4 border rounded shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium truncate">
                      {member.full_name || member.email || `User ${id.substring(0, 8)}`}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => toggleTeamMember(id)}
                    >
                      Remove
                    </Button>
                  </div>
                  {member.country && (
                    <p className="text-sm">{member.city ? `${member.city}, ` : ''}{member.country}</p>
                  )}
                  {member.audio_files && member.audio_files.length > 0 ? (
                    <audio controls className="w-full mt-2">
                      <source src={member.audio_files[0].audio_url} />
                      Your browser doesn't support audio.
                    </audio>
                  ) : (
                    <p className="text-sm text-gray-500">No audio available</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Agent Details Dialog */}
      <AgentDetailsDialog 
        selectedAgentId={selectedAgentId}
        onClose={closeAgentDetails}
      />
    </div>
  );
};

export default Agents;
