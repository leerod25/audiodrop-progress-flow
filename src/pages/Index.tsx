
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileAudio, Upload, UserCircle, Users, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const { user, setUser } = useUserContext();
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
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold mb-2">Welcome to Out-Fons</h1>
        <p className="text-gray-600">Your professional call center solution</p>
      </div>

      {user ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link to="/upload">
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
              <Link to="/">Back to Landing Page</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
