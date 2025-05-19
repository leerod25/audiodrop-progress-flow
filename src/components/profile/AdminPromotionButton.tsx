
import React from 'react';
import { useUserContext } from '@/contexts/UserContext';

const AdminPromotionButton = () => {
  const { user } = useUserContext();
  
  // Only show for admin user with specific email
  if (user?.email !== 'leerod25@hotmail.com') {
    return null;
  }

  // Admin badge only, no longer showing the promotion button
  return null;
};

export default AdminPromotionButton;
