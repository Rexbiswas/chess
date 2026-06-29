import { useGameStore } from '../hooks/useGameStore';
import { motion } from 'framer-motion';
import { Trophy, Award, Trash2, ShieldCheck, Zap, Brain } from 'lucide-react';

export const Stats = () => {
  const { stats, theme, resetStats } = useGameStore();

  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.wins / stats.gamesPlayed) * 100) 
    : 0;

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all game history stats?")) {
      resetStats();
    }
  };

  const getGlowTextClass = () => {
    switch (theme) {
      case 'emerald': return 'text-emerald-450 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]';
      case 'crimson': return 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]';
      case 'gold': return 'text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]';
      default: return 'text-cyber-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]';
    }
  };

  // SVGRing calculations for Circular Win Rate HUD
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (winRate / 100) * circumference;

  const getRingColor = () => {
    switch (theme) {
      case 'emerald': return '#10b981';
      case 'crimson': return '#ef4444';
      case 'gold': return '#eab308';
      default: return '#00f0ff';
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
    <div className="flex-1 flex flex-col gap-6 md:gap-8 overflow-y-auto px-5 pt-5 pb-24 md:p-8 cyber-grid max-w-5xl mx-auto w-full">
      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center md:text-left border-b border-slate-900 pb-5"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-widest uppercase font-mono text-slate-200">
          System <span className={getGlowTextClass()}>Diagnostics</span>
        </h2>
        <p className="text-slate-500 text-xs mt-1.5 uppercase tracking-wider font-semibold">Review operational execution metrics and historic outcomes.</p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* WIN RATE HUD - Radial Circular Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-4 rounded-2xl border border-slate-800/80 bg-slate-950/30 p-6 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="scanner-line" />
          <h3 className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-6 flex items-center gap-2 self-start border-b border-slate-900 pb-2 w-full">
            <Trophy className="h-4 w-4 text-yellow-500" /> Success Coefficient
          </h3>
          
          <div className="relative flex items-center justify-center mb-4">
            {/* SVG Ring */}
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-slate-900/60"
                strokeWidth="7"
                fill="transparent"
              />
              <motion.circle
                cx="72"
                cy="72"
                r={radius}
                stroke={getRingColor()}
                strokeWidth="7"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 6px ${getRingColor()})` }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black font-mono tracking-tighter text-slate-100">
                {winRate}%
              </span>
              <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest mt-1">
                Win Ratio
              </span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 text-center font-bold uppercase tracking-wider mt-2.5">
            Derived from {stats.gamesPlayed} Commences
          </p>
        </motion.div>

        {/* LOG COUNTS - Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 }}
          className="md:col-span-8 grid grid-cols-2 gap-4"
        >
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/20 p-5 flex flex-col justify-between hover:border-slate-700/85 hover:bg-slate-950/30 transition duration-300">
            <span className="text-[9px] uppercase text-slate-500 font-bold tracking-widest flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-400" /> Engagements Won
            </span>
            <div className="mt-4">
              <span className="text-4xl font-extrabold font-mono text-emerald-400 tracking-tight drop-shadow-[0_0_10px_rgba(16,185,129,0.12)]">
                {stats.wins}
              </span>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1.5">Defeated the engine matrix</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/20 p-5 flex flex-col justify-between hover:border-slate-700/85 hover:bg-slate-950/30 transition duration-300">
            <span className="text-[9px] uppercase text-slate-500 font-bold tracking-widest flex items-center gap-2">
              <Award className="h-4 w-4 text-red-500" /> Engagements Lost
            </span>
            <div className="mt-4">
              <span className="text-4xl font-extrabold font-mono text-red-550 tracking-tight drop-shadow-[0_0_10px_rgba(239,68,68,0.12)]">
                {stats.losses}
              </span>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1.5">Neutralized by system Strategy</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/20 p-5 flex flex-col justify-between hover:border-slate-700/85 hover:bg-slate-950/30 transition duration-300">
            <span className="text-[9px] uppercase text-slate-500 font-bold tracking-widest flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-slate-400" /> Draws / Stalemates
            </span>
            <div className="mt-4">
              <span className="text-4xl font-extrabold font-mono text-slate-300 tracking-tight">
                {stats.draws}
              </span>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1.5">Concluded in strategic Balance</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/20 p-5 flex flex-col justify-between hover:border-slate-700/85 hover:bg-slate-950/30 transition duration-300">
            <span className="text-[9px] uppercase text-slate-500 font-bold tracking-widest flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" /> Cumulative Moves
            </span>
            <div className="mt-4">
              <span className="text-4xl font-extrabold font-mono text-cyan-400 tracking-tight drop-shadow-[0_0_10px_rgba(0,240,255,0.12)]">
                {stats.movesCount}
              </span>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1.5">Accumulated across games</p>
            </div>
          </div>
        </motion.div>

        {/* SYSTEM STATUS CARD - Cyberpunk Terminal diagnostics */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="md:col-span-12 rounded-2xl border border-slate-800/80 bg-slate-950/30 p-6.5 backdrop-blur-xl flex flex-col gap-4 relative"
        >
          <h3 className="text-[10px] uppercase text-slate-500 font-bold tracking-widest flex items-center gap-2 border-b border-slate-900 pb-2.5">
            <Brain className={`h-4.5 w-4.5 ${getThemeTextClass()}`} /> Neural Network Diagnostics
          </h3>
          
          <div className="font-mono text-[10px] text-slate-400 flex flex-col gap-2 rounded-xl bg-slate-950 p-4 border border-slate-900 leading-relaxed max-w-full overflow-x-auto shadow-inner">
            <div>&gt; CONNECTING TO STOCKFISH ENGINE CLOUD... <span className="text-emerald-450 font-bold">ONLINE</span></div>
            <div>&gt; ENGINES ACTIVE: stockfish.online API v2 (DEPTH LIMIT: 13)</div>
            <div>&gt; OFFLINE EVALUATOR: Local Minimax with Alpha-Beta Pruning <span className="text-emerald-450 font-bold">STANDBY</span></div>
            <div>&gt; SYSTEM STATE: READY FOR ENGAGEMENT</div>
            <div>&gt; CURRENT DIRECTIVES: MAXIMIZE WIN COEFFICIENT, DEVELOP CENTER SQUARES</div>
          </div>

          {stats.gamesPlayed > 0 && (
            <div className="flex justify-end mt-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-2.5 px-4.5 py-2.5 border border-red-500/20 hover:border-red-500 hover:bg-red-950/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition duration-300 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Purge Systems Cache
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Stats;
