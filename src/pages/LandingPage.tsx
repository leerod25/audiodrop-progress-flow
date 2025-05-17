
import React from 'react';
import { Link } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/contexts/UserContext';

const LandingPage: React.FC = () => {
  const { user } = useUserContext();
  
  return (
    <main className="font-sans antialiased text-gray-900">
      {/* Header with navigation */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Out-Fons</h1>
          <div className="space-x-4">
            {user ? (
              <Button asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/business-signup">Business Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Banner Image with Text Overlay */}
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
                <strong>1. A SOURCE</strong> — the origin or spring from which something flows.
              </p>
              <p className="italic text-gray-200">
                <strong>2. A wellspring of growth, power, and elevation</strong> — built to take your company to the next level.
              </p>
            </div>
            <div className="mt-8 flex gap-4">
              <a
                href="#services"
                className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                Our Services
              </a>
              {!user && (
                <Link
                  to="/auth"
                  className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </AspectRatio>
      </section>
      
      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-20">
          <h2 className="text-4xl font-bold text-center mb-12">Our Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: '/lovable-uploads/ed5f97b2-1407-45b8-9bb1-28e6bd06b1b8.png', 
                title: 'Inbound Support', 
                desc: '24/7 customer care & helpdesk services.' 
              },
              { 
                icon: '/lovable-uploads/c0b61bad-4422-4420-80f6-543de749caec.png', 
                title: 'Outbound Sales', 
                desc: 'Lead generation & appointment setting.' 
              },
              { 
                icon: '/lovable-uploads/a2886422-f9fe-48e8-bd40-e752694fab5f.png', 
                title: 'Consultation', 
                desc: 'Business strategy & customer insights.' 
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="p-6 border rounded-xl hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
              >
                <div className="w-32 h-24 mb-4 overflow-hidden">
                  <img 
                    src={service.icon} 
                    alt={service.title} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h2 className="text-4xl font-bold mb-4">Why <span className="text-blue-600">Fons</span>?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Derived from the Latin word "fons" meaning "source," Out-Fons is your trusted partner in outsourced calling solutions. We specialize in both inbound and outbound calling services, helping businesses connect, support, and grow through powerful human interactions.
            </p>
            <div className="space-y-2 text-gray-700">
              <p className="italic">
                <span className="font-semibold">"Fons potentiae"</span> – a source of strength.
              </p>
              <p className="italic">
                <span className="font-semibold">"Fons progressionis"</span> – a source of growth.
              </p>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img
              src="/lovable-uploads/c725df06-8571-496d-90fe-a8ae1ef80799.png"
              alt="Digital globe network"  
              className="w-full rounded-xl shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Contact / CTA Section */}
      <section className="py-20 bg-white">
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

      {/* Footer */}
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
    </main>
  );
};

export default LandingPage;
