
import React, { useState, useEffect } from 'react';
import { useLatestAudio } from '@/hooks/useLatestAudio';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Mic } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const { audio, loading } = useLatestAudio(user);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        toast.error('You must be logged in to view your profile');
        navigate('/auth');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 max-w-3xl">
      <Card className="bg-white shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link to="/upload">
              <Mic className="mr-2 h-4 w-4" />
              Record New Audio
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {user && (
            <div className="border-b pb-4 mb-4">
              <h2 className="text-lg font-medium mb-2">Account</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Your Recordings</h2>
            
            {loading && <p>Loading your latest audio...</p>}

            {!loading && audio && (
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">{audio.title}</h3>
                <audio controls src={audio.url} className="w-full" />
              </div>
            )}

            {!loading && !audio && (
              <div className="text-center p-6">
                <p className="mb-4 text-gray-600">You haven't saved any audio yet.</p>
                <Button asChild>
                  <Link to="/upload">Record Your First Audio</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
