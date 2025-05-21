import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarUrl?: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Michelle Menifee",
    role: "Student Representative",
    company: "Class",
    quote: "On behalf of our entire class, we want to extend our heartfelt thanks to you, for being an absolute inspiration, TODAY!",
    avatarUrl: "/testimonials/michelle.jpg"
  },
  {
    id: 2,
    name: "Scott Berlyoung",
    role: "Board Member",
    company: "GAHI",
    quote: "On behalf of the GAHI board we would like to say Thank You! Many good reviews of your Al 101 presentation",
    avatarUrl: "/testimonials/scott.jpg"
  },
  {
    id: 3,
    name: "Ian Wiles",
    role: "Camp Participant",
    company: "AI Camp",
    quote: "I think that I underestimated how much I would enjoy this camp. I really enjoyed using AI to make images and adding elements to those images.",
    avatarUrl: "/testimonials/ian.jpg"
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What People Are Saying
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from students, organizations, and community members who've benefited from our AI workshops and services.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-background shadow-md hover:shadow-lg transition-shadow overflow-hidden border-t-4 border-t-primaryBlue">
              <CardContent className="pt-6 pb-8 px-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 border-2 border-primaryBlue/30">
                    {testimonial.avatarUrl ? (
                      <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
                    ) : (
                      <AvatarFallback className="bg-primaryBlue/10 text-primaryBlue">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute top-0 left-0 text-6xl text-primaryBlue/10">"</div>
                  <blockquote className="pl-6 pt-2 text-muted-foreground italic relative">
                    {testimonial.quote}
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 