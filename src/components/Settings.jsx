import { useGameStore } from '../hooks/useGameStore';
import { Volume2, VolumeX, Trash2 } from 'lucide-react';

export const Settings = () => {
  const {
    theme,
    pieceStyle,
    soundMuted,
    stats,
    updateSetting,
    resetStats
  } = useGameStore();

  const themes = [
    { id: 'cyberpunk', name: 'Cyberpunk Neon', colors: ['bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]', 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]'] },
    { id: 'emerald', name: 'Emerald Lux', colors: ['bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]', 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'] },
    { id: 'crimson', name: 'Crimson Flame', colors: ['bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]', 'bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.6)]'] },
    { id: 'gold', name: 'Imperial Gold', colors: ['bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.6)]', 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]'] }
  ];

  const pieceStyles = [
    { id: 'neo', name: 'Neon Glow (Interactive)' },
    { id: 'classic', name: 'Standard Classic' }
  ];

  const handleResetStats = () => {
    if (window.confirm("Are you sure you want to reset all your stats? This cannot be undone.")) {
      resetStats();
    }
  };

  const getActiveBorderGlow = () => {
    switch (theme) {
      case 'emerald': return 'border-emerald-500/40 bg-emerald-950/15 shadow-[0_0_12px_rgba(16,185,129,0.12)] text-emerald-400';
      case 'crimson': return 'border-red-500/40 bg-red-950/15 shadow-[0_0_12px_rgba(239,68,68,0.12)] text-red-400';
      case 'gold': return 'border-yellow-500/40 bg-yellow-950/15 shadow-[0_0_12px_rgba(234,179,8,0.12)] text-yellow-400';
      default: return 'border-cyan-500/40 bg-cyan-950/15 shadow-[0_0_12px_rgba(6,182,212,0.12)] text-cyber-cyan';
    }
  };

  const getThemeTextClass = () => {
    switch (theme) {
      case 'emerald': return 'text-emerald-400';
      case 'crimson': return 'text-red-400';
      case 'gold': return 'text-yellow-400';
      default: return 'text-cyber-cyan';
    }
  };

  return (
    <div className="flex flex-col gap-6 text-slate-200">
      {/* Visual Theme Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
          Visual Theme
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => updateSetting('theme', t.id)}
              className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition duration-300 cursor-pointer hover:border-slate-700/80 ${
                theme === t.id
                  ? getActiveBorderGlow()
                  : 'border-slate-800 bg-slate-900/25 hover:bg-slate-900/40 text-slate-350'
              }`}
            >
              <span className="text-xs font-bold tracking-wide">{t.name}</span>
              <div className="flex gap-1.5 shrink-0">
                <span className={`h-2.5 w-2.5 rounded-full ${t.colors[0]}`} />
                <span className={`h-2.5 w-2.5 rounded-full ${t.colors[1]}`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Piece Style Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
          Piece Representation
        </label>
        <div className="flex flex-col gap-2.5">
          {pieceStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => updateSetting('pieceStyle', style.id)}
              className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition duration-300 cursor-pointer hover:border-slate-700/80 ${
                pieceStyle === style.id
                  ? getActiveBorderGlow()
                  : 'border-slate-800 bg-slate-900/25 hover:bg-slate-900/40 text-slate-350'
              }`}
            >
              <span className="text-xs font-bold tracking-wide">{style.name}</span>
              <span className={`text-[10px] tracking-wider font-mono font-bold ${pieceStyle === style.id ? '' : 'text-slate-500'}`}>
                {pieceStyle === style.id ? 'ACTIVE' : 'SELECT'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sound Options */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
          Audio Controls
        </label>
        <button
          onClick={() => updateSetting('soundMuted', !soundMuted)}
          className={`flex items-center justify-between rounded-xl border p-3.5 transition duration-300 cursor-pointer hover:border-slate-700/80 ${
            !soundMuted
              ? 'border-slate-800 bg-slate-900/25 hover:bg-slate-900/40 text-slate-350'
              : 'border-red-500/25 bg-red-950/10 hover:border-red-500/40 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.05)]'
          }`}
        >
          <div className="flex items-center gap-3">
            {soundMuted ? (
              <VolumeX className="h-4.5 w-4.5 text-red-450" />
            ) : (
              <Volume2 className={`h-4.5 w-4.5 ${getThemeTextClass()}`} />
            )}
            <span className="text-xs font-bold tracking-wide">
              {soundMuted ? 'Muted / Silent' : 'Synthesized Sound Active'}
            </span>
          </div>
          <span className="text-[10px] tracking-wider font-mono font-bold text-slate-500">
            {soundMuted ? 'UNMUTE' : 'MUTE'}
          </span>
        </button>
      </div>

      {/* Statistics Reset */}
      <div className="flex flex-col gap-2 mt-2">
        <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
          Danger Zone
        </label>
        <button
          onClick={handleResetStats}
          disabled={stats.gamesPlayed === 0}
          className={`flex items-center justify-between rounded-xl border p-3.5 text-left text-red-400 transition duration-300 ${
            stats.gamesPlayed > 0 
              ? 'border-red-500/20 bg-red-950/10 hover:bg-red-950/20 hover:border-red-500/40 cursor-pointer' 
              : 'border-slate-900 bg-slate-950/40 opacity-40 cursor-not-allowed text-slate-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <Trash2 className="h-4 w-4" />
            <span className="text-xs font-bold tracking-wide">Reset Local Statistics</span>
          </div>
          <span className="text-[10px] font-mono font-bold tracking-wider">{stats.gamesPlayed} GAMES</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
