import React from 'react';
import { Button } from '@/components/ui/button';
import { useScrollTo } from '@/hooks/useScrollTo';
import { ArrowRight } from 'lucide-react';
import { AuroraBackground } from '@/components/ui/aurora-background';

const HeroSection: React.FC = () => {
  const { scrollToSection } = useScrollTo();

  return (
    <section id="hero" className="relative overflow-hidden">
      <AuroraBackground className="min-h-[90vh] py-20 md:py-32">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Joe's Superman profile photo with enhanced styling */}
            <div className="mx-auto mb-8 w-32 h-32 md:w-40 md:h-40 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-primaryBlue/30 shadow-lg shadow-primaryBlue/10 animate-float">
              <img src="/aijoe_superhero.png" alt="Joe Finkelstein - AI Superman" className="w-full h-full object-cover" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Demystifying AI for <span className="bg-clip-text text-transparent bg-gradient-to-r from-primaryBlue to-blue-600">Middle Georgia</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Unlock the potential of AI in your business and community with expert guidance from AI Joe.
            </p>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <Button 
                size="lg" 
                className="bg-primaryBlue hover:bg-blue-600 text-primary-foreground px-8 py-4 text-lg shadow-lg shadow-primaryBlue/10 hover:shadow-xl hover:shadow-primaryBlue/20 transition-all"
                onClick={() => scrollToSection('contact', -80)}
              >
                Book a Free AI Consultation <ArrowRight size={20} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </AuroraBackground>
    </section>
  );
};

export default HeroSection;
