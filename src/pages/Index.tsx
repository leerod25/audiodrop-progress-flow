import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { FileAudio, Upload, UserCircle, Users, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUsersData } from '@/hooks/useUsersData';
import AgentCard from '@/components/agents/AgentCard';

export default function Index() {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { users: agents, loading } = useUsersData(user);

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

  // If user is logged in, show the dashboard view
  if (user) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold mb-2">Welcome to Out-Fons</h1>
          <p className="text-gray-600">Your professional call center solution</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/upload">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex flex-row items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Upload Audio</h3>
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-gray-600">Upload or record your audio sample</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/profile">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex flex-row items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Your Profile</h3>
                  <UserCircle className="h-6 w-6" />
                </div>
                <p className="text-gray-600">Update your profile information</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/agents">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex flex-row items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Agent Preview</h3>
                  <Users className="h-6 w-6" />
                </div>
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
      </div>
    );
  }

  // Otherwise show the landing page with features
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between px-6">
          <Link to="/" className="text-2xl font-bold">
            Out-Fons
          </Link>
          {/* Navigation with conditional auth links */}
          <nav className="space-x-4 flex items-center">
            <Link to="/agents" className="hover:underline">
              Experts
            </Link>
            <Link to="/auth" className="hover:underline">
              Login / Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-50 text-blue-900 py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-4">
            Outsource Your Sales Team
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Connect with vetted sales experts on demand—boost conversions without overhead.
          </p>
          <Link to="/agents">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
              Browse Experts
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold mb-3">Outbound Sales</h3>
              <p className="text-gray-700">Scale your pipeline with expert-led sales calls tailored to your leads.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold mb-3">Appointment Setting</h3>
              <p className="text-gray-700">Secure qualified meetings directly into your calendar.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold mb-3">Customer Surveys</h3>
              <p className="text-gray-700">Gather insights with customized survey campaigns by our pros.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Experts Preview Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Meet Our Experts</h2>

          {loading ? (
            <p className="text-center text-lg">Loading experts…</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agents.slice(0, 6).map(agent => (
                <AgentCard 
                  key={agent.id}
                  user={agent}
                  canSeeAudio={false}
                  avatarImage={agent.avatar_url || null}
                  getAvatarFallback={(email, gender) => (gender === 'female' ? 'F' : 'M')}
                  onViewProfile={() => navigate(`/agents?id=${agent.id}`)}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/agents">
              <Button variant="link" className="text-blue-600 font-semibold hover:underline">
                View all experts →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Scale Your Sales?</h2>
          <Link to="/auth">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} Out-Fons. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
