import { Section } from "@/components/ui/section";
import { Camera, Award, Users, Globe } from "lucide-react";

const stats = [
  { icon: Camera, value: "1000+", label: "Photo Sessions" },
  { icon: Award, value: "15+", label: "Years Experience" },
  { icon: Users, value: "500+", label: "Happy Clients" },
  { icon: Globe, value: "10+", label: "Countries Visited" },
];

const About = () => {
  return (
    <Section id="about" className="bg-black/50">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-gold/40"></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-gold/40"></div>
          
          <div className="relative z-10 overflow-hidden rounded-lg">
            <img
              src="https://images.pexels.com/photos/3518091/pexels-photo-3518091.jpeg"
              alt="David Smilevski portrait"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent"></div>
          </div>

          <div className="absolute -bottom-6 -right-6 bg-gold text-black font-bold text-lg py-3 px-6 rounded-full shadow-lg transform rotate-12">
            15+ Years
          </div>
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            About <span className="text-gold">David Smilevski</span>
          </h2>
          
          <div className="space-y-4 mb-8 font-body">
            <p className="text-muted-foreground">
              Hi, I'm David Smilevski, a professional photographer based in Bitola, North Macedonia. 
              With over 15 years behind the lens, I've dedicated my career to capturing life's most 
              precious moments through my unique perspective.
            </p>
            <p className="text-muted-foreground">
              My journey in photography began with a passion for storytelling through images. 
              Today, I specialize in portrait and event photography, bringing technical expertise 
              and artistic vision to every shoot. My work is characterized by its attention to 
              detail and ability to capture authentic emotions.
            </p>
            <p className="text-muted-foreground">
              Whether it's a wedding, corporate event, or portrait session, I believe in creating 
              an enjoyable experience while delivering photographs that exceed expectations. My 
              goal is to create timeless images that tell your story and preserve your memories 
              for generations to come.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center justify-center p-4 bg-background/20 rounded-lg border border-border/30 backdrop-blur-sm"
              >
                <stat.icon className="h-6 w-6 text-gold mb-2" />
                <span className="text-2xl font-bold font-heading">{stat.value}</span>
                <span className="text-xs text-muted-foreground font-body">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;