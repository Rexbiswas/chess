import { useEffect, useRef } from 'react';
import { useGameStore } from '../hooks/useGameStore';
import { ScrollText } from 'lucide-react';

export const MoveHistory = () => {
  const history = useGameStore((state) => state.history);
  const theme = useGameStore((state) => state.theme);
  const containerEndRef = useRef(null);

  // Group moves into pairs (1. White Move, Black Move)
  const renderMovePairs = () => {
    const pairs = [];
    for (let i = 0; i < history.length; i += 2) {
      pairs.push({
        num: Math.floor(i / 2) + 1,
        w: history[i],
        b: history[i + 1] || null
      });
    }
    return pairs;
  };

  const movePairs = renderMovePairs();

  // Scroll to bottom on new moves
  useEffect(() => {
    containerEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history.length]);

  const getActiveGlow = () => {
    switch (theme) {
      case 'emerald': return 'border-emerald-500/15 shadow-[0_0_15px_rgba(16,185,129,0.02)]';
      case 'crimson': return 'border-red-500/15 shadow-[0_0_15px_rgba(239,68,68,0.02)]';
      case 'gold': return 'border-yellow-500/15 shadow-[0_0_15px_rgba(234,179,8,0.02)]';
      default: return 'border-cyan-500/15 shadow-[0_0_15px_rgba(0,240,255,0.02)]';
    }
  };

  const getThemeTextClass = () => {
    switch (theme) {
      case 'emerald': return 'text-emerald-450';
      case 'crimson': return 'text-red-400';
      case 'gold': return 'text-yellow-450';
      default: return 'text-cyber-cyan';
    }
  };

  return (
    <div className={`flex flex-col h-full rounded-2xl border bg-slate-950/30 p-4.5 backdrop-blur-xl ${getActiveGlow()}`}>
      <div className="flex items-center gap-2 border-b border-slate-900 pb-3 mb-3 shrink-0 pl-1">
        <ScrollText className={`h-4 w-4 ${getThemeTextClass()}`} />
        <h4 className="text-[10px] font-black tracking-widest uppercase text-slate-400 font-mono">
          Combat Log feed
        </h4>
      </div>

      <div className="flex-1 overflow-y-auto pr-1.5 text-xs font-mono scrollbar">
        {movePairs.length > 0 ? (
          <div className="grid grid-cols-12 gap-y-1.5 text-slate-400">
            {movePairs.map((pair) => (
              <div key={pair.num} className="col-span-12 grid grid-cols-12 items-center py-1 hover:bg-slate-900/20 rounded px-2.5 transition">
                {/* Move Number */}
                <div className="col-span-2 text-slate-600 text-[10px] font-bold">
                  {pair.num.toString().padStart(2, '0')}
                </div>
                
                {/* White Move */}
                <div className="col-span-5 text-slate-200">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-800/80 font-bold tracking-wider">
                    {pair.w.san}
                  </span>
                </div>
                
                {/* Black Move */}
                <div className="col-span-5 text-slate-400">
                  {pair.b ? (
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-900/40 border border-slate-850 tracking-wider">
                      {pair.b.san}
                    </span>
                  ) : (
                    <span className={`text-[10px] italic tracking-wide animate-pulse ${getThemeTextClass()}`}>calculating...</span>
                  )}
                </div>
              </div>
            ))}
            <div ref={containerEndRef} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-600 py-12 shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-widest italic opacity-50">Log matrix empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoveHistory;
