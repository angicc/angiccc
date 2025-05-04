import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import LandingPage from "@/components/LandingPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="smilevski-theme">
      <LandingPage />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;