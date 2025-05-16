import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <main className="font-sans antialiased text-gray-900">
      {/* Top Banner */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-teal-400 text-white py-10">
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <h2 className="text-2xl font-bold mb-4">What is "Fons"?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <p className="text-xl font-semibold mb-2">1. A SOURCE</p>
              <p className="italic">The origin or spring from which something flows.</p>
            </div>
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <p className="text-xl font-semibold mb-2">2. A wellspring of growth</p>
              <p className="italic">Power, and elevation — built to take your company to the next level.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-teal-400 text-white py-20">
        <div className="container mx-auto px-6 lg:px-20">
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
            Out-Fons
          </h1>
          <p className="mt-4 text-xl lg:text-2xl max-w-2xl">
            Professional inbound & outbound calling services that source success for your business.
          </p>
          <div className="mt-8">
            <a
              href="#services"
              className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              Our Services
            </a>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2">
          <img
            src="/lovable-uploads/e27bc858-b9dc-4d9c-bcb8-e45d40d44623.png"
            alt="Call center professional with headset"
            className="w-full h-full object-cover rounded-tl-3xl"
          />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-20">
          <h2 className="text-4xl font-bold text-center mb-12">Our Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: '/lovable-uploads/f8e7309d-1c8f-4710-9de9-8e441da4c651.png', 
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
              src="/lovable-uploads/9139b58b-efe1-4fa6-a944-4d008ab5cdf1.png"
              alt="Call center team member"  
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
          <a
            href="mailto:contact@outfons.com"
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Get in Touch
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-800 text-gray-400 text-center">
        <div className="container mx-auto px-6">
          <p>© {new Date().getFullYear()} Out-Fons. All rights reserved.</p>
          <div className="mt-2">
            <Link to="/auth" className="text-gray-400 hover:text-white mx-2">Login</Link>
            <span className="text-gray-600">|</span>
            <Link to="/" className="text-gray-400 hover:text-white mx-2">Home</Link>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
