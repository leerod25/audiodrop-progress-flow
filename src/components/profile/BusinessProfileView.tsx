
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import BusinessProfileForm from '@/components/BusinessProfileForm';
import BusinessProfileHeader from '@/components/profile/BusinessProfileHeader';
import BusinessProfileIncompleteAlert from '@/components/profile/BusinessProfileIncompleteAlert';

interface BusinessProfileViewProps {
  user: User | null;
  profileCompleted: boolean;
  checkProfileCompletion: (userId: string) => void;
}

const BusinessProfileView = ({
  user,
  profileCompleted,
  checkProfileCompletion
}: BusinessProfileViewProps) => {
  if (!user) return null;
  
  return (
    <motion.div 
      className="container mx-auto py-10 px-4 md:px-6 max-w-3xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-8">
        <Card className="bg-white shadow-md">
          <BusinessProfileHeader profileCompleted={profileCompleted} />
          <CardContent className="space-y-6">
            <BusinessProfileIncompleteAlert isVisible={!profileCompleted} />
            <BusinessProfileForm 
              userId={user.id} 
              onProfileUpdate={() => checkProfileCompletion(user.id)} 
            />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default BusinessProfileView;
