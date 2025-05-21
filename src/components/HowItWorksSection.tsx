import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Coffee, LightbulbIcon, Rocket, MessagesSquare } from 'lucide-react';

type Step = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const steps: Step[] = [
  {
    id: 1,
    title: "Free Initial Consultation",
    description: "We start with a conversation about your business needs and how AI might help. No technical jargon, just practical possibilities.",
    icon: <Coffee size={32} className="text-primaryBlue" />
  },
  {
    id: 2,
    title: "Tailored AI Assessment",
    description: "I'll identify specific AI opportunities for your situation and prepare a clear roadmap with options for implementation.",
    icon: <LightbulbIcon size={32} className="text-primaryBlue" />
  },
  {
    id: 3,
    title: "Implementation Support",
    description: "Whether it's setting up tools, training staff, or connecting with specialists, I'll guide you through putting AI to work.",
    icon: <Rocket size={32} className="text-primaryBlue" />
  },
  {
    id: 4,
    title: "Ongoing Education",
    description: "I provide follow-up support, answer questions, and help you stay current with AI developments relevant to your needs.",
    icon: <MessagesSquare size={32} className="text-primaryBlue" />
  }
];

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple process to help you leverage AI for your business or community organization
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step) => (
              <Card key={step.id} className="bg-background border border-muted shadow-md hover:shadow-lg transition-all hover:border-primaryBlue/40">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="mr-4 mt-1 bg-primaryBlue/10 p-3 rounded-full">
                      {step.icon}
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-primaryBlue flex items-center justify-center text-white font-semibold mr-3">
                          {step.id}
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center p-4 bg-primaryBlue/10 rounded-lg">
              <CheckCircle size={24} className="text-primaryBlue mr-2" />
              <p className="text-foreground font-medium">
                No long-term contracts or commitments – just practical AI guidance when you need it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection; 