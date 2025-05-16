
import React, { ReactNode } from 'react';
import LoginStatusBadge from '@/components/LoginStatusBadge';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <div className="fixed top-2 right-2 z-50">
        <LoginStatusBadge />
      </div>
      {children}
    </div>
  );
};

export default AppLayout;
