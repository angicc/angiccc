import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Camera } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      )}
    >
      <Container>
        <nav className="flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2">
            <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-black border border-gold">
              <Camera className="w-6 h-6 text-gold" />
            </div>
            <span className="text-xl font-semibold tracking-tight">
              Smilevski <span className="text-gold">Photography</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm font-medium hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-full"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground"
            >
              <div className="space-y-1.5">
                <span
                  className={cn(
                    "block h-0.5 w-6 bg-current transition-all",
                    isMobileMenuOpen && "translate-y-2 rotate-45"
                  )}
                ></span>
                <span
                  className={cn(
                    "block h-0.5 w-6 bg-current transition-all",
                    isMobileMenuOpen && "opacity-0"
                  )}
                ></span>
                <span
                  className={cn(
                    "block h-0.5 w-6 bg-current transition-all",
                    isMobileMenuOpen && "-translate-y-2 -rotate-45"
                  )}
                ></span>
              </div>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden fixed inset-x-0 bg-background/95 backdrop-blur-sm transition-all duration-300 ease-in-out overflow-hidden",
            isMobileMenuOpen
              ? "max-h-[calc(100vh-4rem)] opacity-100 shadow-lg"
              : "max-h-0 opacity-0"
          )}
        >
          <ul className="flex flex-col gap-2 p-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block py-2 px-4 text-foreground hover:text-gold hover:bg-accent/50 rounded-md transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;