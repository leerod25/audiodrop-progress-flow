
import React from 'react';

const ServicesSection: React.FC = () => {
  const services = [
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
  ];

  return (
    <section id="services" className="py-20 bg-blue-50">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-4xl font-bold text-center mb-12">Our Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="p-6 border rounded-xl bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
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
  );
};

export default ServicesSection;
