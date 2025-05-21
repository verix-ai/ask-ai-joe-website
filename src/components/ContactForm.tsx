import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('Form submitted with data:', formData);

    try {
      // Use Formspree instead of our custom API
      const response = await fetch('https://formspree.io/f/xjvnpyqd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      console.log('Formspree response:', response);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Formspree error:', errorText);
        
        toast({
          title: 'Submission Failed',
          description: 'An error occurred during form submission. Please try again.',
          variant: "destructive",
        });
      } else {
        console.log('Form submitted successfully');
        
        toast({
          title: 'Message Sent!',
          description: "Thank you for your message. We'll be in touch soon.",
          className: "bg-green-500 text-white",
        });
        
        // Clear the form on success
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      }
    } catch (e: any) {
      console.error('Unexpected error during form submission:', e);
      toast({
        title: "Unexpected Error",
        description: e.message || "An unknown error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-foreground">Name <span className="text-destructive">*</span></Label>
        <Input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 bg-background border-border focus:ring-primaryBlue focus:border-primaryBlue" />
      </div>
      <div>
        <Label htmlFor="email" className="text-foreground">Email <span className="text-destructive">*</span></Label>
        <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 bg-background border-border focus:ring-primaryBlue focus:border-primaryBlue" />
      </div>
      <div>
        <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
        <Input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 bg-background border-border focus:ring-primaryBlue focus:border-primaryBlue" />
      </div>
      <div>
        <Label htmlFor="company" className="text-foreground">Company</Label>
        <Input type="text" name="company" id="company" value={formData.company} onChange={handleChange} className="mt-1 bg-background border-border focus:ring-primaryBlue focus:border-primaryBlue" />
      </div>
      <div>
        <Label htmlFor="message" className="text-foreground">Message <span className="text-destructive">*</span></Label>
        <Textarea name="message" id="message" rows={4} value={formData.message} onChange={handleChange} required className="mt-1 bg-background border-border focus:ring-primaryBlue focus:border-primaryBlue" />
      </div>
      <div>
        <Button 
          type="submit" 
          className="w-full bg-primaryBlue hover:bg-blue-600 text-primary-foreground py-3 text-base" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;

