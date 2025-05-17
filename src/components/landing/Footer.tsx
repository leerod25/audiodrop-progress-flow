
import React from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '@/contexts/UserContext';

const Footer: React.FC = () => {
  const { user } = useUserContext();
  
  return (
    <footer className="py-6 bg-gray-800 text-gray-400 text-center">
      <div className="container mx-auto px-6">
        <p>© {new Date().getFullYear()} Out-Fons. All rights reserved.</p>
        <div className="mt-2">
          <Link to="/auth" className="text-gray-400 hover:text-white mx-2">Login</Link>
          <span className="text-gray-600">|</span>
          {user ? (
            <Link to="/dashboard" className="text-gray-400 hover:text-white mx-2">Dashboard</Link>
          ) : (
            <Link to="/business-signup" className="text-gray-400 hover:text-white mx-2">Business Sign Up</Link>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
