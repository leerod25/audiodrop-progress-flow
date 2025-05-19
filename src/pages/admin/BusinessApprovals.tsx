
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserContext } from '@/contexts/UserContext';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { Shield, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BusinessProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string | null;
  is_verified: boolean;
  country: string | null;
  city: string | null;
  business_name?: string | null;
}

const BusinessApprovals: React.FC = () => {
  const { user, userRole } = useUserContext();
  const [pendingBusinesses, setPendingBusinesses] = useState<BusinessProfile[]>([]);
  const [incomingBusinesses, setIncomingBusinesses] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  if (!user || userRole !== 'admin') {
    toast.error("You don't have permission to view this page");
    return <Navigate to="/" replace />;
  }

  // Load existing unverified businesses
  useEffect(() => {
    const fetchPendingBusinesses = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'business')
          .eq('is_verified', false);
          
        if (error) {
          console.error('Error fetching businesses:', error);
          toast.error('Failed to load pending businesses');
          return;
        }
        
        setPendingBusinesses(data || []);
      } catch (err) {
        console.error('Unexpected error:', err);
        toast.error('An error occurred while loading businesses');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingBusinesses();
    
    // Subscribe to new business signups
    const channel = supabase
      .channel('business-signups')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'profiles',
          filter: 'role=eq.business'
        },
        (payload) => {
          // Handle new business signup
          const newBusiness = payload.new as BusinessProfile;
          setIncomingBusinesses(prev => [newBusiness, ...prev]);
          toast.info('New business signup detected!');
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleApprove = async (id: string) => {
    try {
      // Update profile to set is_verified to true
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', id);
        
      if (error) {
        console.error('Error approving business:', error);
        toast.error('Failed to approve business');
        return;
      }
      
      toast.success('Business approved successfully');
      
      // Remove from pending list
      setPendingBusinesses(prev => prev.filter(b => b.id !== id));
      // Also remove from incoming if it's there
      setIncomingBusinesses(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An error occurred while approving business');
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      // For now, just delete the user's profile
      // In a production app, you might want to call an edge function to delete the auth user
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error rejecting business:', error);
        toast.error('Failed to reject business');
        return;
      }
      
      toast.success('Business rejected and removed');
      
      // Remove from pending list
      setPendingBusinesses(prev => prev.filter(b => b.id !== id));
      // Also remove from incoming if it's there
      setIncomingBusinesses(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An error occurred while rejecting business');
    }
  };
  
  // Move an incoming business to pending list
  const handleReviewLater = (business: BusinessProfile) => {
    setPendingBusinesses(prev => [business, ...prev]);
    setIncomingBusinesses(prev => prev.filter(b => b.id !== business.id));
    toast('Business moved to pending list', {
      description: 'You can review it later'
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6 text-purple-600" />
        <h1 className="text-3xl font-bold">Business Approvals</h1>
      </div>
      
      {/* New incoming businesses section */}
      {incomingBusinesses.length > 0 && (
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-blue-800">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                New Business Signups
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {incomingBusinesses.map((business) => (
              <div key={business.id} className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{business.business_name || business.full_name || 'Unnamed Business'}</h3>
                    <p className="text-sm text-gray-600">{business.email}</p>
                    {business.country && (
                      <p className="text-sm text-gray-500">
                        {[business.city, business.country].filter(Boolean).join(", ")}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      Signed up {new Date(business.created_at || '').toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    New
                  </Badge>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleReviewLater(business)}
                  >
                    Review Later
                  </Button>
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => handleReject(business.id)}
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Reject
                  </Button>
                  <Button 
                    variant="default"
                    size="sm"
                    onClick={() => handleApprove(business.id)}
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* Pending businesses section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Pending Businesses
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>Loading pending businesses...</p>
            </div>
          ) : pendingBusinesses.length === 0 ? (
            <Alert>
              <AlertDescription>
                No pending businesses to review at this time.
              </AlertDescription>
            </Alert>
          ) : (
            pendingBusinesses.map((business) => (
              <div key={business.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{business.business_name || business.full_name || 'Unnamed Business'}</h3>
                    <p className="text-sm text-gray-600">{business.email}</p>
                    {business.country && (
                      <p className="text-sm text-gray-500">
                        {[business.city, business.country].filter(Boolean).join(", ")}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      Signed up {new Date(business.created_at || '').toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => handleReject(business.id)}
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Reject
                  </Button>
                  <Button 
                    variant="default"
                    size="sm"
                    onClick={() => handleApprove(business.id)}
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessApprovals;
