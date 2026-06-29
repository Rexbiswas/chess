import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Stats from './pages/Stats';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';
import Modal from './components/Modal';
import { useGameStore } from './hooks/useGameStore';
import { soundEffects } from './utils/soundEffects';

export const App = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const theme = useGameStore((state) => state.theme);

  // Initialize sounds and preferences on application launch
  useEffect(() => {
    soundEffects.init();
  }, []);

  // Theme gradient background class selector
  const getThemeBackground = () => {
    switch (theme) {
      case 'emerald':
        return 'bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-950';
      case 'crimson':
        return 'bg-gradient-to-br from-slate-950 via-rose-950 to-red-950';
      case 'gold':
        return 'bg-gradient-to-br from-slate-950 via-stone-900 to-yellow-950';
      default:
        // Cyberpunk (Default)
        return 'bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950';
    }
  };

  return (
    <Router>
      <div className={`relative flex flex-col md:flex-row h-screen w-screen overflow-hidden ${getThemeBackground()} transition-all duration-500`}>
        {/* Cyberpunk grid overlay for high-fidelity gaming aesthetic */}
        <div className="absolute inset-0 cyber-grid pointer-events-none opacity-50 z-0" />

        {/* Floating glow nodes for depth */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Sidebar Navigation */}
        <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />

        {/* Main Content Area */}
        <main className="flex-1 relative z-10 flex flex-col overflow-hidden min-h-0 h-full pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </main>

        {/* Settings Configurations Panel (accessible globally) */}
        <Modal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          title="System Settings"
        >
          <Settings />
        </Modal>
      </div>
    </Router>
  );
};
export default App;
