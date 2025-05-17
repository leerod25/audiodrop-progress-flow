
import React from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '@/contexts/UserContext';

const CtaSection: React.FC = () => {
  const { user } = useUserContext();
  
  return (
    <section className="py-20 bg-blue-50">
      <div className="container mx-auto px-6 lg:px-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Connect?</h2>
        <p className="text-gray-700 mb-8 max-w-xl mx-auto">
          Partner with Out-Fons and let us become the fountain of communication excellence for your brand.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:contact@outfons.com"
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Get in Touch
          </a>
          {!user && (
            <Link
              to="/auth"
              className="inline-block bg-white border border-blue-600 text-blue-600 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-blue-50 transition-colors duration-300"
            >
              Sign Up Now
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
