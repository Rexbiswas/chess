import { useGameStore } from '../hooks/useGameStore';
import { Clock } from 'lucide-react';
import { Chess } from 'chess.js';

export const Timer = ({ color }) => {
  const clock = useGameStore((state) => state.clocks[color]);
  const fen = useGameStore((state) => state.fen);
  const status = useGameStore((state) => state.status);
  const theme = useGameStore((state) => state.theme);

  const chess = new Chess(fen);
  const activeTurn = chess.turn();
  const isActive = activeTurn === color && status === 'playing';

  // Format seconds to MM:SS
  const formatTime = (totalSeconds) => {
    if (totalSeconds < 0) return '00:00';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Urgent styling when time is short (< 15 seconds)
  const isUrgent = clock <= 15;

  const getUrgentClass = () => {
    if (!isUrgent) return '';
    return 'text-red-500 animate-pulse border-red-500/40 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.25)]';
  };

  // Color classes depending on theme and activity
  const getThemeClass = () => {
    if (isUrgent) return getUrgentClass();
    if (!isActive) return 'border-slate-900 text-slate-500 bg-slate-950/30';

    switch (theme) {
      case 'emerald':
        return 'border-emerald-500/45 text-emerald-400 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.12)]';
      case 'crimson':
        return 'border-red-500/45 text-red-400 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.12)]';
      case 'gold':
        return 'border-yellow-500/45 text-yellow-400 bg-yellow-950/20 shadow-[0_0_15px_rgba(234,179,8,0.12)]';
      default:
        // Cyberpunk
        return 'border-cyan-500/45 text-cyber-cyan bg-cyan-950/20 shadow-[0_0_15px_rgba(0,240,255,0.12)]';
    }
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-3.5 py-1.5 font-mono text-sm font-bold transition-all duration-300 ${getThemeClass()}`}
    >
      <div className="relative flex items-center justify-center">
        <Clock className={`h-4 w-4 ${isActive && !isUrgent ? 'animate-pulse text-cyan-400' : ''}`} />
        {isActive && (
          <span className={`absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping`} />
        )}
      </div>
      <span className="tracking-widest">{formatTime(clock)}</span>
    </div>
  );
};

export default Timer;
