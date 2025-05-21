import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ContactForm: React.FC = () => {
  return (
    // Use native HTML form submission with GET method
    <form 
      action="https://getform.io/f/3b87e1c7-9d6a-473f-af02-80759069847e" 
      method="POST" 
      className="space-y-6"
    >
      <div>
        <Label htmlFor="name" className="text-foreground">Name <span className="text-destructive">*</span></Label>
        <Input type="text" name="name" id="name" required className="mt-1 bg-background border-border focus:ring-primaryBlue focus:border-primaryBlue" />
      </div>
      <div>
        <Label htmlFor="email" className="text-foreground">Email <span className="text-destructive">*</span></Label>
        <Input type="email" name="email" id="email" required className="mt-1 bg-background border-border focus:ring-primaryBlue focus:border-primaryBlue" />
      </div>
      <div>
        <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
        <Input type="tel" name="phone" id="phone" className="mt-1 bg-background border-border focus:ring-primaryBlue focus:border-primaryBlue" />
      </div>
      <div>
        <Label htmlFor="company" className="text-foreground">Company</Label>
        <Input type="text" name="company" id="company" className="mt-1 bg-background border-border focus:ring-primaryBlue focus:border-primaryBlue" />
      </div>
      <div>
        <Label htmlFor="message" className="text-foreground">Message <span className="text-destructive">*</span></Label>
        <Textarea name="message" id="message" rows={4} required className="mt-1 bg-background border-border focus:ring-primaryBlue focus:border-primaryBlue" />
      </div>
      <div>
        <Button 
          type="submit" 
          className="w-full bg-primaryBlue hover:bg-blue-600 text-primary-foreground py-3 text-base"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;

