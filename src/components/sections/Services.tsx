import { Section } from "@/components/ui/section";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const services = [
  {
    title: "Portrait Sessions",
    price: "€150",
    description: "Professional portrait photography for individuals or groups",
    features: [
      "1-hour photo session",
      "2 outfit changes",
      "10 professionally edited photos",
      "Online gallery for easy sharing",
      "One 8x10 printed photo",
    ],
    popular: false,
  },
  {
    title: "Wedding Photography",
    price: "€1,200",
    description: "Complete wedding day coverage with premium deliverables",
    features: [
      "Full day coverage (up to 10 hours)",
      "Second photographer included",
      "Engagement photo session",
      "300+ edited photos",
      "Custom wedding album",
      "Online gallery with digital downloads",
    ],
    popular: true,
  },
  {
    title: "Event Coverage",
    price: "€400",
    description: "Professional photography for special events and celebrations",
    features: [
      "4 hours of event coverage",
      "100+ edited high-resolution photos",
      "Quick turnaround (7 days)",
      "Online gallery for guests",
      "Commercial usage rights",
    ],
    popular: false,
  },
];

const Services = () => {
  return (
    <Section id="services" className="bg-background relative overflow-hidden">
      {/* Circuit pattern background */}
      <div className="absolute inset-0 opacity-5">
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="circuitPattern"
              patternUnits="userSpaceOnUse"
              width="100"
              height="100"
            >
              <path
                d="M 0,50 L 50,50 L 50,0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-gold"
              />
              <circle cx="50" cy="50" r="3" className="fill-gold" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuitPattern)" />
        </svg>
      </div>
      
      <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Photography <span className="text-gold">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from my range of professional photography services, each 
            tailored to meet your specific needs and create incredible visual memories.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={cn(
                "rounded-xl overflow-hidden",
                "border border-border transition-all duration-300",
                "flex flex-col",
                service.popular ? 
                  "md:scale-105 shadow-xl border-gold" : 
                  "hover:border-gold/50 hover:shadow-lg"
              )}
            >
              {service.popular && (
                <div className="bg-gold text-black text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-gold">{service.price}</span>
                  <span className="ml-1 text-muted-foreground">/ package</span>
                </div>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-gold shrink-0 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-6 pt-0 mt-auto">
                <Button 
                  className={cn(
                    "w-full",
                    service.popular
                      ? "bg-gold hover:bg-gold/90 text-black"
                      : ""
                  )}
                  variant={service.popular ? "default" : "outline"}
                  asChild
                >
                  <a href="#contact">Book Now</a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">
            Need a custom photography package for your specific requirements?
          </p>
          <Button 
            variant="outline" 
            className="border-gold/60 text-gold hover:bg-gold/10"
            asChild
          >
            <a href="#contact">Request Custom Quote</a>
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default Services;