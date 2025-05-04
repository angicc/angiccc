import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, CameraIcon } from "lucide-react";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background"></div>
        <img
          src="https://images.pexels.com/photos/7320254/pexels-photo-7320254.jpeg"
          alt="Photography background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Digital circuit lines (decorative) */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <pattern
              id="grid"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 8 0 L 0 0 0 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.2"
                className="text-blue-400"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Animated particles */}
      <div
        className={cn(
          "absolute inset-0 z-0 opacity-0 transition-opacity duration-1000",
          isLoaded && "opacity-30"
        )}
      >
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gold/80"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite, pulse ${
                Math.random() * 2 + 2
              }s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Content */}
      <div
        className={cn(
          "relative z-10 text-center px-4 max-w-5xl mx-auto transition-all duration-1000 transform translate-y-10 opacity-0",
          isLoaded && "translate-y-0 opacity-100"
        )}
      >
        {/* Logo */}
        <div className="inline-flex items-center justify-center mb-8">
          <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-black/80 border-2 border-gold shadow-[0_0_15px_rgba(212,175,55,0.5)]">
            <CameraIcon className="w-10 h-10 text-gold" />
            <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-ping"></div>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight text-white">
          Smilevski <span className="text-gold">Photography</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8">
          Capturing moments, crafting memories, and creating visual stories that
          last a lifetime.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gold hover:bg-gold/90 text-black font-medium"
            asChild
          >
            <a href="#portfolio">View Portfolio</a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-gold/60 text-gold hover:bg-gold/10"
            asChild
          >
            <a href="#contact" className="group">
              Book a Session
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
        </div>
        <span className="text-white/70 text-xs mt-2">Scroll Down</span>
      </div>
    </section>
  );
};

export default Hero;