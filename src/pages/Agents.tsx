
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Define the User interface to match what we see in the screenshots
interface User {
  id: string;
  full_name: string | null;
  email: string | null;
  country: string | null;
  city: string | null;
  computer_skill_level: string | null;
  phone: string | null;
}

const Agents: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllUsers() {
      try {
        setLoading(true);
        
        // First, get users from the profiles table
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          toast.error("Failed to load users");
          return;
        }
        
        console.log('Profiles found:', profilesData?.length || 0);
        
        // Set the users from profiles data
        setUsers(profilesData || []);
      } catch (err) {
        console.error('Error:', err);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
    
    loadAllUsers();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">All Users ({users.length})</h1>
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-xl text-gray-500">No users found</p>
              <p className="text-sm text-gray-400 mt-2">This may be because you only have access to profiles and not all auth users.</p>
            </div>
          ) : (
            users.map(user => (
              <Card key={user.id} className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">User ID</p>
                      <p className="text-sm text-gray-600 break-all">{user.id}</p>
                    </div>
                    <div>
                      <p className="font-medium">Name</p>
                      <p className="text-sm text-gray-600">{user.full_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600">{user.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-gray-600">
                        {user.country ? `${user.country}${user.city ? `, ${user.city}` : ''}` : 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-gray-600">{user.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Computer Skill Level</p>
                      <p className="text-sm text-gray-600">{user.computer_skill_level || 'Not specified'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Important Note</h2>
        <p className="text-gray-700">
          Currently, we can only access profiles from the database, not all Auth users. 
          To see all Auth users (as shown in your screenshot), we would need to:
        </p>
        <ol className="list-decimal ml-6 mt-2 text-gray-700 space-y-2">
          <li>Create a secure server-side API endpoint with admin credentials</li>
          <li>Use that endpoint to fetch all users from Supabase Auth</li>
          <li>Display those results instead of just the profiles data</li>
        </ol>
        <p className="mt-4 text-gray-700">
          This would require a backend service which isn't currently set up in this client-side only application.
        </p>
      </div>
      
      {/* Raw data for debugging */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Raw User Data</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-xs">
          {JSON.stringify(users, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Agents;
