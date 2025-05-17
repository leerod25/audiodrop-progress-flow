
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUserContext } from '@/contexts/UserContext';
import { 
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";

// Define the User interface from Supabase Auth
interface User {
  id: string;
  email: string | null;
  app_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
  created_at: string;
  last_sign_in_at?: string | null;
  audio_files?: AudioFile[];
}

// Interface for audio files
interface AudioFile {
  id: string;
  title: string;
  audio_url: string;
  created_at: string;
}

// Data structure returned from the edge function
interface UsersResponse {
  users: User[];
}

const Agents: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserContext();
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call our edge function to get all users
      const { data, error } = await supabase.functions.invoke('list-users');
      
      if (error) {
        console.error('Error calling edge function:', error);
        setError('Failed to fetch users: ' + error.message);
        toast.error("Failed to load users");
        return;
      }

      // Data contains the users
      const response = data as UsersResponse;
      console.log('Users found:', response?.users?.length || 0);
      
      if (response?.users) {
        setUsers(response.users);
      } else {
        setError('No users data returned');
        toast.error("No users data returned");
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred: ' + err.message);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if user is logged in
    if (user) {
      fetchAllUsers();
    } else {
      setLoading(false);
      setError("Please log in to view users");
    }
  }, [user]);

  // Toggle expanded state for a user
  const toggleUserExpand = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">All Users ({users.length})</h1>
      
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          <p>{error}</p>
          {!user && (
            <p className="mt-2">You need to be logged in to view all users.</p>
          )}
        </div>
      ) : loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <div className="space-y-6">
          {users.length === 0 ? (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-xl text-gray-500">No users found</p>
            </div>
          ) : (
            users.map(user => (
              <Card key={user.id} className="shadow-sm overflow-hidden">
                <CardHeader className="cursor-pointer bg-gray-50" 
                  onClick={() => toggleUserExpand(user.id)}>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{user.email || 'No Email'}</CardTitle>
                    <div className="text-sm text-blue-600 hover:underline">
                      {expandedUser === user.id ? 'Hide Details' : 'Show Details'}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className={expandedUser === user.id ? "block" : "hidden"}>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <p className="font-medium">User ID</p>
                      <p className="text-sm text-gray-600 break-all">{user.id}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Created At</p>
                        <p className="text-sm text-gray-600">{new Date(user.created_at).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="font-medium">Last Sign In</p>
                        <p className="text-sm text-gray-600">
                          {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg mb-2">Audio Files ({user.audio_files?.length || 0})</h3>
                      {!user.audio_files || user.audio_files.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No audio files found for this user</p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Title</TableHead>
                              <TableHead>Created</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {user.audio_files.map(file => (
                              <TableRow key={file.id}>
                                <TableCell>{file.title}</TableCell>
                                <TableCell>{new Date(file.created_at).toLocaleString()}</TableCell>
                                <TableCell>
                                  <audio 
                                    controls 
                                    src={file.audio_url}
                                    className="w-full max-w-[300px]"
                                  >
                                    Your browser does not support audio playback
                                  </audio>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          
          <div className="flex justify-center mt-6">
            <Button 
              onClick={fetchAllUsers}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {loading ? 'Loading...' : 'Refresh User List'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;
