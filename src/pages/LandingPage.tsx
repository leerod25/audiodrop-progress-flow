
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <main className="font-sans antialiased text-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-teal-400 text-white h-screen flex items-center">
        <div className="container mx-auto px-6 lg:px-20">
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
            Out-Fons
          </h1>
          <p className="mt-4 text-xl lg:text-2xl max-w-2xl">
            Professional inbound & outbound calling services that source success for your business.
          </p>
          <p className="mt-2 italic text-gray-200">
            <strong>Fons</strong> (Latin): "source" or "fountain"
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
            src="https://source.unsplash.com/collection/190727/800x800"
            alt="Call center team"
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
              { icon: '📞', title: 'Inbound Support', desc: '24/7 customer care & helpdesk services.' },
              { icon: '📈', title: 'Outbound Sales', desc: 'Lead generation & appointment setting.' },
              { icon: '🤝', title: 'Consultation', desc: 'Business strategy & customer insights.' },
            ].map((service, idx) => (
              <div
                key={idx}
                className="p-6 border rounded-xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
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
            <p className="text-gray-700 leading-relaxed">
              In ancient Rome, <strong>fons</strong> referred to a spring or fountain—a source of life-giving water.
              At Out-Fons, we're your source of high-quality voice services,
              ensuring your business stays fueled with clear communication, meaningful connections, and growth.
            </p>
          </div>
          <div className="lg:w-1/2">
            <img
              src="https://source.unsplash.com/collection/864044/800x600"
              alt="Fountain origin"  
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
