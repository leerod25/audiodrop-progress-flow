
import React, { useState, useEffect } from 'react';
import { useLatestAudio } from '@/hooks/useLatestAudio';
import { useUserAudios } from '@/hooks/useUserAudios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Mic } from 'lucide-react';
import DownloadButton from '@/components/DownloadButton';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const { audio, loading: loadingSingle } = useLatestAudio(user);
  const { audios, loading: loadingAll } = useUserAudios(user);
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
            
            {loadingAll && <p>Loading your audio recordings...</p>}

            {!loadingAll && audios.length === 0 && (
              <div className="text-center p-6">
                <p className="mb-4 text-gray-600">You haven't saved any audio yet.</p>
                <Button asChild>
                  <Link to="/upload">Record Your First Audio</Link>
                </Button>
              </div>
            )}

            {!loadingAll && audios.length > 0 && (
              <div className="space-y-4">
                {audios.map((item) => (
                  <div key={item.id} className="p-4 border rounded-md space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{item.title}</h3>
                      <DownloadButton 
                        url={item.audio_url} 
                        filename={`${item.title}.webm`}
                      />
                    </div>
                    <audio controls src={item.audio_url} className="w-full" />
                    <p className="text-xs text-gray-500">
                      Recorded on {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
