
import { useCallback } from 'react';

export const useScrollTo = () => {
  const scrollToSection = useCallback((sectionId: string, offset: number = 0) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const y = section.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      console.warn(`Scroll target #${sectionId} not found.`);
    }
  }, []);

  return { scrollToSection };
};
