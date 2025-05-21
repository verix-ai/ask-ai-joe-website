import React from 'react';
import { useScrollTo } from '@/hooks/useScrollTo';
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const { scrollToSection } = useScrollTo();

  const socialLinks = [
    { icon: <Facebook size={18} />, href: "https://facebook.com/askaijoe", label: "Facebook" },
    { icon: <Twitter size={18} />, href: "https://twitter.com/askaijoe", label: "Twitter" },
    { icon: <Linkedin size={18} />, href: "https://linkedin.com/in/joefinkelstein", label: "LinkedIn" },
    { icon: <Mail size={18} />, href: "mailto:aijoe.superhero@gmail.com", label: "Email" },
  ];

  const navLinks = [
    { label: "Home", section: "hero" },
    { label: "About", section: "about" },
    { label: "Services", section: "services" },
    { label: "How It Works", section: "how-it-works" },
    { label: "Testimonials", section: "testimonials" },
    { label: "Blog", section: "blog" },
    { label: "Contact", section: "contact" },
  ];

  return (
    <footer className="bg-card pt-12 pb-6 text-card-foreground border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          {/* Logo and About - Centered */}
          <div className="md:col-span-2 flex flex-col items-center text-center">
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold">Ask</span>
              <div className="w-8 h-8 mx-1 rounded-lg bg-primaryBlue flex items-center justify-center text-white font-bold text-lg">AI</div>
              <span className="text-xl font-bold">Joe</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md text-center">
              Making AI accessible and practical for businesses and communities in Middle Georgia.
            </p>
            <div className="flex space-x-3 mb-6">
              {socialLinks.map((link, i) => (
                <a 
                  key={i}
                  href={link.href} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-primaryBlue hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-muted pt-6 flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground mb-2">
            &copy; {new Date().getFullYear()} AskAiJoe.com. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="/privacy" className="text-sm text-muted-foreground hover:text-primaryBlue transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-sm text-muted-foreground hover:text-primaryBlue transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
