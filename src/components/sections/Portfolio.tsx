import { useState } from "react";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { motion } from "@/lib/motion";
import { Button } from "@/components/ui/button";

const categories = [
  { id: "all", label: "All Work" },
  { id: "sports", label: "Sports" },
  { id: "events", label: "Events" },
  { id: "teams", label: "Team Photos" },
];

const portfolioItems = [
  {
    id: 1,
    category: "events",
    title: "Fan Celebration",
    description: "Capturing the intense atmosphere of fan celebrations with flares",
    image: "/images/fan-celebration.jpg",
  },
  {
    id: 2,
    category: "sports",
    title: "Soccer Action",
    description: "Dynamic soccer match photography capturing key moments",
    image: "/images/soccer-action.jpg",
  },
  {
    id: 3,
    category: "teams",
    title: "Basketball Team",
    description: "Professional team photography for the season",
    image: "/images/basketball-team.jpg",
  },
  {
    id: 4,
    category: "sports",
    title: "Training Session",
    description: "Capturing athletes during practice",
    image: "/images/training.jpg",
  },
  {
    id: 5,
    category: "sports",
    title: "Winter Match",
    description: "Soccer match in snowy conditions",
    image: "/images/winter-match.jpg",
  }
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredItems =
    activeCategory === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  return (
    <Section id="portfolio" className="bg-background circuit-pattern">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          Portfolio <span className="text-gold">Gallery</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto font-body">
          Explore my collection of sports and event photography, showcasing the energy,
          emotion, and excellence of athletes and teams in action.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            className={cn(
              "font-body",
              activeCategory === category.id &&
                "bg-gold hover:bg-gold/90 text-black"
            )}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="group relative overflow-hidden rounded-lg bg-black aspect-[4/3]"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <h3 className="text-white text-lg font-heading">{item.title}</h3>
              <p className="text-gold capitalize font-body text-sm mb-1">{item.category}</p>
              <p className="text-white/80 text-sm font-body">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Button
          variant="outline"
          className="border-gold/60 text-gold hover:bg-gold/10 font-body"
        >
          View Complete Portfolio
        </Button>
      </div>
    </Section>
  );
};

export default Portfolio;