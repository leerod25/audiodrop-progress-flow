
import React, { useState, useEffect } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Clock, CheckCircle, XCircle, Calendar, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import BusinessInviteForm from '@/components/auth/BusinessInviteForm';
import Header from '@/components/landing/Header';
import LoginStatusBadge from '@/components/LoginStatusBadge';
import { Navigate } from 'react-router-dom';

interface Invitation {
  id: string;
  email: string;
  token: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
  invited_by: string;
}

const BusinessInvitations = () => {
  const { user, userRole } = useUserContext();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Redirect if not admin
  if (userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('business_invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invitations:', error);
        toast.error('Failed to load invitations');
        return;
      }

      setInvitations(data || []);
    } catch (err) {
      console.error('Error fetching invitations:', err);
      toast.error('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const deleteInvitation = async (invitationId: string) => {
    setDeletingId(invitationId);
    
    try {
      const { error } = await supabase
        .from('business_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) {
        console.error('Error deleting invitation:', error);
        toast.error('Failed to delete invitation');
        return;
      }

      toast.success('Invitation deleted successfully');
      // Refresh the invitations list
      fetchInvitations();
    } catch (err) {
      console.error('Error deleting invitation:', err);
      toast.error('Failed to delete invitation');
    } finally {
      setDeletingId(null);
    }
  };

  const getInvitationStatus = (invitation: Invitation) => {
    const now = new Date();
    const expiresAt = new Date(invitation.expires_at);
    
    if (invitation.used_at) {
      return { status: 'used', label: 'Used', color: 'bg-green-100 text-green-800' };
    } else if (expiresAt < now) {
      return { status: 'expired', label: 'Expired', color: 'bg-red-100 text-red-800' };
    } else {
      return { status: 'active', label: 'Active', color: 'bg-blue-100 text-blue-800' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const copyInviteLink = (token: string) => {
    const inviteUrl = `${window.location.origin}/agents?invite_token=${token}`;
    navigator.clipboard.writeText(inviteUrl);
    toast.success('Invite link copied to clipboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Container className="py-8">
          {/* Login Status Badge */}
          <div className="mb-4 flex justify-end">
            <LoginStatusBadge />
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Container className="py-8">
        {/* Login Status Badge */}
        <div className="mb-4 flex justify-end">
          <LoginStatusBadge />
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Business Invitations</h1>
            <p className="text-muted-foreground">
              Manage email invitations for business preview access
            </p>
          </div>

          {/* Send new invitation form */}
          <div className="flex justify-center">
            <BusinessInviteForm />
          </div>

          {/* Invitations list */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Sent Invitations ({invitations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invitations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No invitations sent yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {invitations.map((invitation) => {
                    const { status, label, color } = getInvitationStatus(invitation);
                    
                    return (
                      <div
                        key={invitation.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{invitation.email}</span>
                            <Badge className={color}>{label}</Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Sent: {formatDate(invitation.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Expires: {formatDate(invitation.expires_at)}</span>
                            </div>
                            {invitation.used_at && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>Used: {formatDate(invitation.used_at)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {status === 'active' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyInviteLink(invitation.token)}
                            >
                              Copy Link
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteInvitation(invitation.id)}
                            disabled={deletingId === invitation.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {deletingId === invitation.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default BusinessInvitations;
