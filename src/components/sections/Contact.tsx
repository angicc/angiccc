import { useState } from 'react';
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter 
} from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "info@smilevskiphotography.com",
    href: "mailto:info@smilevskiphotography.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+389 70 123 456",
    href: "tel:+38970123456",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Bitola, North Macedonia",
    href: "https://maps.google.com/?q=Bitola,North+Macedonia",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@smilevskiphotography",
    href: "https://www.instagram.com/smilevskiphotography/",
  },
  {
    icon: Facebook,
    label: "Facebook",
    value: "SmilevskiPhotography",
    href: "https://www.facebook.com/",
  },
  {
    icon: Twitter,
    label: "Twitter",
    value: "@smilevskiphoto",
    href: "https://twitter.com/",
  },
];

const serviceOptions = [
  "Portrait Photography",
  "Wedding Photography",
  "Event Coverage",
  "Family Photography",
  "Commercial Photography",
  "Other",
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, service: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you shortly.",
      });
      setFormData({
        name: "",
        email: "",
        service: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Section id="contact" className="bg-background relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[linear-gradient(90deg,rgba(200,200,200,.075)_1px,transparent_0),linear-gradient(rgba(200,200,200,.075)_1px,transparent_0)] bg-[length:24px_24px]"></div>
      </div>
      
      <div className="relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get In <span className="text-gold">Touch</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to discuss your photography needs? Contact me today to book a session
            or request more information about my services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Contact form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service">Service Interested In</Label>
                <Select 
                  value={formData.service} 
                  onValueChange={handleServiceChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your photography needs..."
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gold hover:bg-gold/90 text-black"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
          
          {/* Contact information */}
          <div className="bg-black/30 rounded-xl p-8 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-6 text-gold">Contact Information</h3>
            
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start group"
                >
                  <div className="bg-gold/10 p-3 rounded-full mr-4 group-hover:bg-gold/20 transition-colors">
                    <item.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium group-hover:text-gold transition-colors">
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
            
            <div className="mt-10">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Business Hours</h4>
              <div className="space-y-2 text-sm">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed (Available for events only)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Contact;