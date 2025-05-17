
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
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
  );
};

export default AboutSection;
