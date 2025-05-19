
import React, { useState } from 'react';
import { Calendar, Headphones, Search } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

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
    <div className="py-16 bg-white">
      <Container>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional call center solutions tailored to your business needs
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

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">Ready to elevate your customer outreach?</h2>
          <Button asChild size="lg" className="px-8">
            <Link to="/contact">Get Started Today</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default ServicesPage;
