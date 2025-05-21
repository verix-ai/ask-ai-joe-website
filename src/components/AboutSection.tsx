
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section 
      id="about" 
      className="py-16 md:py-24 bg-background animate-fade-in-up"
      style={{ animationDelay: '0.2s' }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            About Joe Finkelstein
          </h2>
          <div className="space-y-4 text-lg text-muted-foreground">
            <p>
              Joe Finkelstein is a passionate AI educator, writer, and consultant based in Macon, Georgia. With a knack for making complex topics accessible, Joe is dedicated to empowering the local community with the knowledge and tools to navigate the evolving landscape of artificial intelligence.
            </p>
            <p>
              His mission is to bridge the gap between advanced AI concepts and practical, everyday applications, ensuring that everyone from local residents and students to small business owners and community organizations can benefit from AI's potential.
            </p>
            <p>
              Through AskAiJoe.com, Joe offers insightful articles, engaging workshops, and personalized consulting services tailored to the unique needs of Middle Georgia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
