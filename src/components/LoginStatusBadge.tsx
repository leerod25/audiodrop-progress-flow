
import React from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { Badge } from '@/components/ui/badge';
import { User, LogIn } from 'lucide-react';

const LoginStatusBadge = () => {
  const { user, userRole } = useUserContext();
  
  if (!user) {
    return (
      <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
        <LogIn className="h-3 w-3" />
        <span>Logged out</span>
      </Badge>
    );
  }
  
  // Determine badge color based on user role
  const getBadgeColor = () => {
    switch(userRole) {
      case 'agent':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'business':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'admin':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };
  
  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1 ${getBadgeColor()}`}
    >
      <User className="h-3 w-3" />
      <span>Logged in as: {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'Unknown'}</span>
    </Badge>
  );
};

export default LoginStatusBadge;
