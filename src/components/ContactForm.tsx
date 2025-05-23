import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { subscribeToMailchimp } from '@/services/mailchimp';

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
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('Form submitted with data:', formData);

    try {
      console.log('Calling subscribeToMailchimp...');
      // Call our direct Mailchimp service
      const response = await subscribeToMailchimp(formData);
      console.log('Got response from subscribeToMailchimp:', response);

      if (!response.success) {
        console.error('Error subscribing to Mailchimp:', response.error);
        
        toast({
          title: response.error || 'Subscription Failed',
          description: response.detail || 'An error occurred during subscription. Please try again.',
          variant: "destructive",
        });
      } else {
        console.log('Successfully subscribed to Mailchimp:', response);
        
        // No toast message on success, just clear the form
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
        setSubmitted(true);
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

  if (submitted) {
    return (
      <div className="text-center p-8 bg-muted rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Thank you for your message!</h3>
        <p>We've received your information and will be in touch soon.</p>
      </div>
    );
  }

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

