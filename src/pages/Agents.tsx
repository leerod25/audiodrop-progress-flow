
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  full_name: string | null;
  email: string | null;
  country: string | null;
  city: string | null;
  computer_skill_level: string | null;
}

const Agents: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        // Direct query to get all profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          console.error('Error fetching users:', error);
          return;
        }
        
        console.log('Users found:', data?.length || 0);
        console.log('User data:', data);
        
        setUsers(data || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadUsers();
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
