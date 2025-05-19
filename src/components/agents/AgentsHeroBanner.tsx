
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AgentsHeroBannerProps {
  isLoggedIn: boolean;
}

const AgentsHeroBanner: React.FC<AgentsHeroBannerProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  return (
    <section className="w-full relative">
      <AspectRatio ratio={3/1} className="bg-gradient-to-r from-gray-700 to-gray-900">
        <img 
          src="/lovable-uploads/2e644405-88f8-49aa-8ff8-2c0429dc7cb9.png" 
          alt="Headset on laptop keyboard" 
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-20 text-white">
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
            Agent Profiles
          </h1>
          <p className="mt-4 text-xl lg:text-2xl max-w-2xl">
            Browse our skilled agents and choose the perfect team for your business needs.
          </p>
          <p className="mt-3 text-lg">
            <strong>You're in control</strong> - handpick your team for guaranteed success.
          </p>
          <div className="flex gap-4 mt-6">
            <Button 
              size="lg" 
              variant="default" 
              onClick={() => navigate('/services')}
            >
              Our Services
            </Button>
            {!isLoggedIn && (
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/auth')}
              >
                Login / Sign Up
              </Button>
            )}
          </div>
        </div>
      </AspectRatio>
    </section>
  );
};

export default AgentsHeroBanner;
