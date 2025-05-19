
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/contexts/UserContext';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useUserContext();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Out-Fons
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link to="/services" className="text-gray-700 hover:text-blue-600 transition-colors">
            Services
          </Link>
          <Link to="/agents" className="text-gray-700 hover:text-blue-600 transition-colors">
            Agents
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/auth?tab=signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0"
        >
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
              Home
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
              Services
            </Link>
            <Link to="/agents" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
              Agents
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                  Dashboard
                </Link>
                <Button variant="outline" onClick={handleLogout} className="w-full">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/auth">Login</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/auth?tab=signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
