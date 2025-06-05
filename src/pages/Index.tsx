
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileAudio, Upload, UserCircle, Users, LogOut, Mail, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export default function Index() {
  const { user, setUser, userRole } = useUserContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Banner */}
      <div className="mb-8">
        <AspectRatio ratio={3/1} className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg overflow-hidden">
          <img 
            src="/lovable-uploads/37aa98f0-a023-48e6-84d4-c255f9eec315.png" 
            alt="Call center agents with headsets" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-20 text-white">
            <h1 className="text-4xl font-bold mb-2">Welcome to Out-Fons Dashboard</h1>
            <p className="text-xl">Let's get started with your professional call center solution</p>
          </div>
        </AspectRatio>
      </div>

      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Manage Your Call Center Resources</h2>
        <p className="text-gray-600">Access your tools and resources below</p>
      </div>

      {user ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link to="/upload-audio">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Upload Audio</CardTitle>
                  <Upload className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Upload or record your audio sample</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/profile">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Your Profile</CardTitle>
                  <UserCircle className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Update your profile information</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/agents">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Agent Preview</CardTitle>
                  <Users className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Preview available agents and audio samples</p>
                </CardContent>
              </Card>
            </Link>

            {/* Admin-only cards */}
            {userRole === 'admin' && (
              <>
                <Link to="/admin/business-invitations">
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-blue-200 bg-blue-50">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-blue-900">Send Business Invites</CardTitle>
                      <Mail className="h-6 w-6 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-blue-700">Send preview invitations to businesses</p>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/admin/business-approvals">
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-green-200 bg-green-50">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-green-900">Business Approvals</CardTitle>
                      <Shield className="h-6 w-6 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-green-700">Review and approve business applications</p>
                    </CardContent>
                  </Card>
                </Link>
              </>
            )}
          </div>

          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-center mb-4">Please log in or sign up to continue</p>
          <div className="flex gap-4">
            <Button asChild>
              <Link to="/auth">Login / Sign Up</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/landing">Back to Landing Page</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
