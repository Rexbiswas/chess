import { NavLink } from 'react-router-dom';
import { Home, Sword, BarChart2, Settings as SettingsIcon } from 'lucide-react';
import { useGameStore } from '../hooks/useGameStore';

export const Sidebar = ({ onOpenSettings }) => {
  const theme = useGameStore((state) => state.theme);

  const getThemeTextGlow = () => {
    switch (theme) {
      case 'emerald': return 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]';
      case 'crimson': return 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]';
      case 'gold': return 'text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]';
      default: return 'text-cyan-450 drop-shadow-[0_0_8px_rgba(0,240,255,0.55)]';
    }
  };

  const getThemeBorderClass = () => {
    switch (theme) {
      case 'emerald': return 'border-emerald-500/15';
      case 'crimson': return 'border-red-500/15';
      case 'gold': return 'border-yellow-500/15';
      default: return 'border-cyan-500/15';
    }
  };

  const getThemeIndicatorBg = () => {
    switch (theme) {
      case 'emerald': return 'bg-emerald-400 shadow-[0_0_10px_#10b981]';
      case 'crimson': return 'bg-red-500 shadow-[0_0_10px_#ef4444]';
      case 'gold': return 'bg-yellow-500 shadow-[0_0_10px_#eab308]';
      default: return 'bg-cyber-cyan shadow-[0_0_10px_#00f0ff]';
    }
  };

  const getLinkClasses = ({ isActive }) => {
    const base = "relative flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 group overflow-hidden ";
    if (isActive) {
      switch (theme) {
        case 'emerald': return base + "bg-emerald-950/25 border border-emerald-500/25 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]";
        case 'crimson': return base + "bg-red-950/25 border border-red-500/25 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.05)]";
        case 'gold': return base + "bg-yellow-950/25 border border-yellow-500/25 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.05)]";
        default: return base + "bg-cyan-950/25 border border-cyan-500/25 text-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.05)]";
      }
    }
    return base + "border border-transparent text-slate-450 hover:text-slate-200 hover:bg-slate-900/30";
  };

  const getMobileLinkClasses = ({ isActive }) => {
    const base = "flex flex-col items-center justify-center gap-1.5 flex-1 py-1.5 text-[9px] font-bold tracking-widest uppercase transition-all duration-300 relative ";
    if (isActive) {
      switch (theme) {
        case 'emerald': return base + "text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.45)]";
        case 'crimson': return base + "text-red-450 drop-shadow-[0_0_6px_rgba(239,68,68,0.45)]";
        case 'gold': return base + "text-yellow-400 drop-shadow-[0_0_6px_rgba(234,179,8,0.45)]";
        default: return base + "text-cyber-cyan drop-shadow-[0_0_6px_rgba(0,240,255,0.45)]";
      }
    }
    return base + "text-slate-500 hover:text-slate-350";
  };

  return (
    <>
      {/* 1. MOBILE TOP HEADER */}
      <header className={`md:hidden w-full h-15 flex items-center justify-between px-5 bg-slate-950/75 backdrop-blur-xl border-b z-30 shrink-0 ${getThemeBorderClass()}`}>
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center h-8 w-8 rounded-lg bg-slate-900 border border-slate-800">
            <Sword className={`h-4.5 w-4.5 ${getThemeTextGlow()} transform -rotate-45`} />
          </div>
          <span className="text-xs font-black tracking-widest uppercase font-mono">
            NEON<span className={getThemeTextGlow()}>CHESS</span>
          </span>
        </div>
        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 text-slate-400 hover:text-slate-200 active:scale-95 transition"
        >
          <SettingsIcon className="h-4 w-4" />
        </button>
      </header>

      {/* 2. MOBILE BOTTOM NAVBAR */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-950/90 backdrop-blur-xl border-t flex items-center justify-around z-40 px-3 pb-safe ${getThemeBorderClass()}`}>
        <NavLink to="/" className={getMobileLinkClasses}>
          {({ isActive }) => (
            <>
              <Home className="h-4.5 w-4.5" />
              <span>Console</span>
              {isActive && (
                <span className={`absolute -top-1.5 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full ${getThemeIndicatorBg()}`} />
              )}
            </>
          )}
        </NavLink>

        <NavLink to="/game" className={getMobileLinkClasses}>
          {({ isActive }) => (
            <>
              <Sword className="h-4.5 w-4.5" />
              <span>Arena</span>
              {isActive && (
                <span className={`absolute -top-1.5 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full ${getThemeIndicatorBg()}`} />
              )}
            </>
          )}
        </NavLink>

        <NavLink to="/stats" className={getMobileLinkClasses}>
          {({ isActive }) => (
            <>
              <BarChart2 className="h-4.5 w-4.5" />
              <span>System</span>
              {isActive && (
                <span className={`absolute -top-1.5 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full ${getThemeIndicatorBg()}`} />
              )}
            </>
          )}
        </NavLink>
      </nav>

      {/* 3. DESKTOP SIDEBAR */}
      <aside className={`hidden md:flex w-64 flex-col bg-slate-950/45 border-r p-6 transition-all duration-500 shrink-0 backdrop-blur-2xl relative overflow-y-auto max-h-screen ${getThemeBorderClass()}`}>
        {/* Subtle grid pattern inside sidebar */}
        <div className="absolute inset-0 bg-slate-950/15 pointer-events-none z-0" />
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 mb-6 relative z-10">
          <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-slate-900/80 border border-slate-800 shadow-inner">
            <Sword className={`h-5 w-5 ${getThemeTextGlow()} transform -rotate-45`} />
          </div>
          <h1 className="text-sm font-black tracking-widest uppercase font-mono">
            NEON<span className={getThemeTextGlow()}>CHESS</span>
          </h1>
        </div>

        {/* Navigation Options */}
        <nav className="flex flex-col gap-1.5 flex-1 relative z-10">
          <NavLink to="/" className={getLinkClasses}>
            {({ isActive }) => (
              <>
                <Home className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                <span className="relative z-10">Battle Console</span>
                {isActive && (
                  <span className={`absolute left-0 top-1/4 h-1/2 w-1 rounded-r-lg ${getThemeIndicatorBg()}`} />
                )}
              </>
            )}
          </NavLink>

          <NavLink to="/game" className={getLinkClasses}>
            {({ isActive }) => (
              <>
                <Sword className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                <span className="relative z-10">Play Arena</span>
                {isActive && (
                  <span className={`absolute left-0 top-1/4 h-1/2 w-1 rounded-r-lg ${getThemeIndicatorBg()}`} />
                )}
              </>
            )}
          </NavLink>

          <NavLink to="/stats" className={getLinkClasses}>
            {({ isActive }) => (
              <>
                <BarChart2 className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                <span className="relative z-10">Diagnostics</span>
                {isActive && (
                  <span className={`absolute left-0 top-1/4 h-1/2 w-1 rounded-r-lg ${getThemeIndicatorBg()}`} />
                )}
              </>
            )}
          </NavLink>
        </nav>

        {/* Footer / Settings Button */}
        <div className="flex flex-col gap-2 mt-auto border-t border-slate-900/80 pt-5 relative z-10">
          <button
            onClick={onOpenSettings}
            className="flex w-full items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase text-slate-400 hover:text-slate-200 hover:bg-slate-900/30 border border-transparent transition duration-300 cursor-pointer group"
          >
            <SettingsIcon className="h-4 w-4 transition-transform group-hover:rotate-90 duration-500" />
            <span>Config Panel</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
