
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useUserContext } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface AudioFile {
  id: string;
  title: string;
  audio_url: string;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  audio_files: AudioFile[];
  country?: string | null;
  city?: string | null;
}

const Agents: React.FC = () => {
  const { user, userRole } = useUserContext();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const PAGE_SIZE = 9;
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Call our edge function to get all users
        const { data, error } = await supabase.functions.invoke('list-users', {
          body: { businessOnly: false }
        });
        
        if (error) {
          console.error('Error calling edge function:', error);
          setError('Failed to fetch users: ' + error.message);
          return;
        }

        // Process users and add audio data
        const processedUsers = await Promise.all((data.users || []).map(async (user: User) => {
          // Get profile data
          const { data: profileData } = await supabase
            .from('profiles')
            .select('country, city')
            .eq('id', user.id)
            .single();
          
          // Get audio files
          const { data: audioData } = await supabase
            .from('audio_metadata')
            .select('id, title, audio_url, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          return {
            ...user,
            country: profileData?.country || null,
            city: profileData?.city || null,
            audio_files: audioData || []
          };
        }));
        
        setUsers(processedUsers);
      } catch (err: any) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Calculate pagination values
  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentPageUsers = users.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Agent Profiles ({users.length})</h1>
      
      {!user && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <InfoIcon className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800">Limited Preview Mode</AlertTitle>
          <AlertDescription className="text-amber-700">
            You're viewing agent profiles in preview mode. To access audio samples and contact information, please register or log in.
            <div className="mt-3 flex flex-wrap gap-3">
              <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700">
                <Link to="/auth">Log In</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-100">
                <Link to="/auth?tab=signup">Sign Up</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      ) : loading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {currentPageUsers.map((u) => {
              // If user is a business or viewing their own profile, show audio
              const canSeeAudio = userRole === 'business' || u.id === user?.id;
              const audioFiles = canSeeAudio ? u.audio_files : [];
              
              return (
                <Card key={u.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">ID: {u.id.substring(0, 8)}...</h3>
                          <p className="text-sm text-gray-600">{u.email}</p>
                          
                          {/* Location info if available */}
                          {(u.country || u.city) && (
                            <p className="text-sm text-gray-500 mt-1">
                              {[u.city, u.country].filter(Boolean).join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Audio preview section */}
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-medium mb-2">Audio Samples:</h4>
                        
                        {audioFiles.length > 0 ? (
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-xs text-gray-500 mb-2">{audioFiles[0].title}</p>
                            <audio 
                              controls
                              preload="none"
                              className="w-full"
                              src={audioFiles[0].audio_url}
                            >
                              Your browser doesn't support audio.
                            </audio>
                            {audioFiles.length > 1 && (
                              <p className="text-xs text-gray-500 mt-2">
                                +{audioFiles.length - 1} more recordings
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            {!canSeeAudio && user 
                              ? "Audio samples restricted" 
                              : "No audio samples available"}
                          </p>
                        )}
                      </div>
                      
                      {/* View profile link */}
                      <div className="mt-4 flex justify-end">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                        >
                          <Link to={`/agents/${u.id}`}>View Full Profile</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink 
                      onClick={() => setPage(p)}
                      isActive={page === p}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default Agents;
