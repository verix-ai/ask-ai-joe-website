import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, BarChart, Users } from 'lucide-react'; // Updated icons

const services = [
  {
    icon: <Briefcase size={40} className="text-primaryBlue" />,
    title: "AI Consulting",
    description: "Customized strategies to integrate AI into your business operations.",
  },
  {
    icon: <BarChart size={40} className="text-primaryBlue" />,
    title: "AI Marketing",
    description: "Innovative, AI-powered solutions for content and customer engagement.",
  },
  {
    icon: <Users size={40} className="text-primaryBlue" />,
    title: "Educational Workshops",
    description: "Interactive AI learning experiences for schools, teams, and communities.",
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section 
      id="services" 
      className="py-16 md:py-24 bg-muted/50 animate-fade-in-up"
      style={{ animationDelay: '0.3s' }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How I Can Help
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Offering a range of services to help you navigate and harness the power of AI.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="text-center transform hover:scale-105 transition-transform duration-300 ease-out shadow-lg hover:shadow-xl"
              // Add individual animation delay for cards if desired, or inherit section's animation
              // style={{ animationDelay: `${0.3 + index * 0.1}s` }} // Example for staggered card animation
            >
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-2xl text-foreground">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
