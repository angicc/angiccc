import { useEffect, useState } from "react";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Aleksandra Petrovic",
    role: "Bride",
    text: "Milan captured our wedding day beautifully. His ability to find perfect moments amid the chaos of the day was remarkable. The photos exceeded our expectations and will be treasured for generations.",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
  },
  {
    id: 2,
    name: "Nikola Dimitrov",
    role: "Business Owner",
    text: "We hired Smilevski Photography for our company event, and the results were outstanding. Professional, unobtrusive, and the quality of photos perfectly captured the energy of our celebration.",
    image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
  },
  {
    id: 3,
    name: "Elena Trajkova",
    role: "Model",
    text: "Working with Milan was a joy from start to finish. He has an incredible eye for lighting and composition. The portraits he created for my portfolio are absolutely stunning and have helped me secure multiple jobs.",
    image: "https://images.pexels.com/photos/773371/pexels-photo-773371.jpeg",
  },
  {
    id: 4,
    name: "Marko Stefanovski",
    role: "Family Client",
    text: "Our family photos turned out amazing! Milan was great with our kids and somehow managed to get everyone looking good in the same shot - a miracle! The whole experience was fun and stress-free.",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Section id="testimonials" className="bg-black/50">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Client <span className="text-gold">Testimonials</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Hear what my clients have to say about their experiences and the 
          photographs that captured their special moments.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Large quote icon */}
        <Quote className="absolute -top-10 -left-8 text-gold/20 w-24 h-24 z-0" />

        {/* Testimonial slider */}
        <div className="relative h-[320px] md:h-[250px]">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={cn(
                "absolute top-0 left-0 w-full h-full flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 rounded-xl bg-background/5 backdrop-blur-sm border border-border/30",
                "transition-all duration-700",
                index === activeIndex
                  ? "opacity-100 transform translate-x-0 scale-100 z-10"
                  : "opacity-0 transform translate-x-40 scale-95 z-0"
              )}
            >
              <div className="flex-shrink-0">
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-gold/40">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="flex-grow">
                <blockquote className="italic text-lg text-foreground/90 mb-4">
                  "{testimonial.text}"
                </blockquote>
                <div>
                  <h4 className="font-semibold text-gold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots navigation */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === activeIndex ? "bg-gold w-6" : "bg-muted-foreground/30"
              )}
              onClick={() => setActiveIndex(index)}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Testimonials;