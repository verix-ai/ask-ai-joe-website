import React, { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollTo } from '@/hooks/useScrollTo';

const NavLinks = [
  { name: 'Home', id: 'hero' },
  { name: 'About', id: 'about' },
  { name: 'Services', id: 'services' },
  { name: 'AI Columns', id: 'blog' },
  { name: 'Contact', id: 'contact' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollToSection } = useScrollTo();
  const navOffset = -80; // Adjust this value based on your fixed navbar height

  const handleScroll = (id: string) => {
    scrollToSection(id, navOffset);
    setIsOpen(false); // Close mobile menu on link click
  };

  return (
    <nav className="bg-background/80 backdrop-blur-md shadow-sm fixed w-full z-50 top-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#" onClick={(e) => { e.preventDefault(); handleScroll('hero'); }} className="flex items-center">
              <span className="text-xl font-bold">Ask</span>
              <div className="w-7 h-7 mx-1 rounded-lg bg-primaryBlue flex items-center justify-center text-white font-bold text-base">AI</div>
              <span className="text-xl font-bold">Joe.com</span>
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {NavLinks.map((link) => (
              <a
                key={link.name}
                href={`#${link.id}`}
                onClick={(e) => { e.preventDefault(); handleScroll(link.id); }}
                className="text-foreground hover:text-primaryBlue px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}
            <Button onClick={() => handleScroll('contact')} className="bg-primaryBlue hover:bg-blue-600 text-white">
              <Phone size={18} className="mr-2" />
              Book a Consultation
            </Button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primaryBlue focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primaryBlue"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background shadow-lg" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NavLinks.map((link) => (
              <a
                key={link.name}
                href={`#${link.id}`}
                onClick={(e) => { e.preventDefault(); handleScroll(link.id); }}
                className="text-foreground hover:text-primaryBlue hover:bg-muted block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}
            <Button onClick={() => handleScroll('contact')} className="w-full mt-2 bg-primaryBlue hover:bg-blue-600 text-white">
              <Phone size={18} className="mr-2" />
              Book a Consultation
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
