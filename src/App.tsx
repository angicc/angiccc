import { useState } from 'react';
import DashboardShell from './components/layout/DashboardShell';
import LandingPage from './components/views/LandingPage';

function App() {
  const [showLanding, setShowLanding] = useState(true);

  if (showLanding) {
    return <LandingPage onEnterApp={() => setShowLanding(false)} />;
  }

  return <DashboardShell />;
}

export default App;
