
import React from 'react';
import ContactForm from './ContactForm';
import { Card } from '@/components/ui/card';

const ContactSection: React.FC = () => {
  return (
    <section 
      id="contact" 
      className="py-16 md:py-24 bg-muted/30 animate-fade-in-up"
      style={{ animationDelay: '0.5s' }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Let's Connect
            </h2>
            <p className="text-lg text-muted-foreground">
              Have a question, project idea, or just want to learn more about AI? Reach out!
              Book your free AI consultation today.
            </p>
          </div>
          <Card className="p-6 sm:p-8 shadow-xl bg-background">
            <ContactForm />
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
