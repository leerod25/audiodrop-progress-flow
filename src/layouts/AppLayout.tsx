
import React, { ReactNode } from 'react';
import LoginStatusBadge from '@/components/LoginStatusBadge';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/' || location.pathname === '/landing';
  
  return (
    <div className="min-h-screen">
      <div className="fixed top-2 right-2 z-50">
        <LoginStatusBadge />
      </div>
      
      {/* Return to Dashboard button - hidden on landing page */}
      {!isLandingPage && (
        <div className="fixed top-2 left-2 z-50">
          <Button 
            asChild 
            variant="secondary" 
            size="sm"
            className="flex items-center gap-2 shadow-md"
          >
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      )}
      
      {children}
    </div>
  );
};

export default AppLayout;
