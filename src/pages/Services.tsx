
import React, { useState } from 'react';
import { Calendar, Headphones, Search } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Footer from '@/components/landing/Footer';

interface Service {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: React.ElementType;
}

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const services: Service[] = [
    {
      id: "appointment-setting",
      title: "APPOINTMENT SETTING",
      shortDescription: "Schedule qualified appointments directly onto your sales teams calendar",
      fullDescription: "Our appointment setting service focuses on securing high-quality meetings with decision-makers who are genuinely interested in your solutions. We handle the entire process from initial outreach to calendar scheduling, allowing your sales team to focus solely on closing deals. With our skilled agents, we ensure each appointment is properly qualified and prepared, increasing your conversion rates significantly.",
      icon: Calendar
    },
    {
      id: "warm-transfer",
      title: "WARM TRANSFER",
      shortDescription: "Connect qualified prospects directly to your sales team",
      fullDescription: "With our warm transfer service, we identify and engage potential customers, qualify their interest and needs, and then seamlessly transfer them to your sales representatives in real-time. This creates a smooth transition for the prospect and provides your team with pre-qualified leads ready for meaningful conversations. Our agents brief your team before each transfer, ensuring they have the context needed to continue the conversation effectively.",
      icon: Headphones
    },
    {
      id: "lead-qualification",
      title: "LEAD QUALIFICATION",
      shortDescription: "Qualify and convert your inbound leads",
      fullDescription: "Our lead qualification service helps you separate genuine opportunities from casual inquiries. We contact each lead promptly, ask targeted qualifying questions, assess their fit with your solution, and rank them according to their readiness to purchase. This process ensures your sales team only invests time in prospects with a high probability of conversion, significantly improving your ROI on lead generation efforts.",
      icon: Search
    },
    {
      id: "market-research",
      title: "MARKET RESEARCH",
      shortDescription: "Conduct surveys and gather information",
      fullDescription: "Our market research service provides valuable insights about your target audience, competitors, and industry trends. We conduct professional telephone interviews, online surveys, and focus groups to collect high-quality data that informs your strategic decisions. Whether you're launching a new product, entering a new market, or refining your value proposition, our research delivers the actionable intelligence you need to make informed choices.",
      icon: Search
    }
  ];

  const toggleService = (id: string) => {
    setSelectedService(selectedService === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Banner - Matching landing page style */}
      <section className="w-full relative">
        <AspectRatio ratio={3/1} className="bg-gradient-to-r from-gray-700 to-gray-900">
          <img 
            src="/lovable-uploads/2e644405-88f8-49aa-8ff8-2c0429dc7cb9.png" 
            alt="Call center services" 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-20 text-white">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
              Our Services
            </h1>
            <p className="mt-4 text-xl lg:text-2xl max-w-2xl">
              Professional call center solutions where <span className="font-semibold">you</span> choose your team and stay in control.
            </p>
            <p className="mt-4 text-lg max-w-2xl">
              We believe in transparency and giving you the power to select the perfect agents for your business needs, 
              guaranteeing better results through genuine collaboration.
            </p>
          </div>
        </AspectRatio>
      </section>

      <Container className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Tailored Calling Solutions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our range of specialized services and the agents that best fit your business needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service) => (
            <div 
              key={service.id}
              className="rounded-lg border border-gray-200 overflow-hidden"
            >
              <div 
                className={`p-6 cursor-pointer transition-colors ${
                  selectedService === service.id 
                    ? "bg-blue-50" 
                    : "hover:bg-gray-50"
                }`}
                onClick={() => toggleService(service.id)}
              >
                <div className="flex items-center gap-4 mb-3">
                  <service.icon className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-bold">{service.title}</h3>
                </div>
                <p className="text-gray-600">{service.shortDescription}</p>
              </div>
              
              <AnimatePresence>
                {selectedService === service.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200 bg-white"
                  >
                    <div className="p-6">
                      <p className="text-gray-700 mb-4">{service.fullDescription}</p>
                      <div className="flex justify-end">
                        <Button asChild variant="outline" size="sm">
                          <Link to="/contact">Contact us about this service</Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-8 rounded-lg mb-16">
          <h3 className="text-2xl font-bold mb-4 text-center">Your Team, Your Control</h3>
          <p className="text-center mb-6">
            Unlike traditional call centers, Out-Fons puts you in the driver's seat by letting you:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-bold mb-2">Select Your Agents</h4>
              <p className="text-gray-600">Browse and choose agents that match your specific business needs and culture.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-bold mb-2">Monitor Performance</h4>
              <p className="text-gray-600">Track results in real-time and make adjustments to optimize your campaigns.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-bold mb-2">Scale As Needed</h4>
              <p className="text-gray-600">Easily expand or reduce your team based on your current business requirements.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">Ready to elevate your customer outreach?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link to="/agents">Browse Our Agents</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8">
              <Link to="/contact">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default ServicesPage;
