
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const HeroBanner: React.FC = () => {
  return (
    <section className="w-full relative">
      <AspectRatio ratio={3/1} className="bg-gradient-to-r from-gray-700 to-gray-900">
        <img 
          src="/lovable-uploads/2e644405-88f8-49aa-8ff8-2c0429dc7cb9.png" 
          alt="Headset on laptop keyboard" 
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-20 text-white">
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
            Out-Fons
          </h1>
          <p className="mt-4 text-xl lg:text-2xl max-w-2xl">
            Professional inbound & outbound calling services that source success for your business.
          </p>
          <div className="mt-4 space-y-2">
            <p className="italic text-gray-200">
              <span className="block"><i>Fons</i> (Latin): the origin or spring from which something flows.</span>
              <strong className="block mt-1">1. A SOURCE</strong>
            </p>
            <p className="italic text-gray-200">
              <strong>2. A wellspring of growth, power, and elevation</strong> — built to take your company to the next level.
            </p>
          </div>
          <div className="mt-8 flex gap-4">
            <a
              href="#actions"
              className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              Get Started
            </a>
          </div>
        </div>
      </AspectRatio>
    </section>
  );
};

export default HeroBanner;
