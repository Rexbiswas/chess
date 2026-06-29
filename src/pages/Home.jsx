import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../hooks/useGameStore';
import { motion } from 'framer-motion';
import { Cpu, User, Clock, Shield, Play, Trophy, Activity, Award } from 'lucide-react';

const TIME_PRESETS = [
  { name: 'Bullet 1+0', duration: 60, increment: 0 },
  { name: 'Blitz 3+2', duration: 180, increment: 2 },
  { name: 'Blitz 5+0', duration: 300, increment: 0 },
  { name: 'Rapid 10+5', duration: 600, increment: 5 },
  { name: 'Rapid 15+10', duration: 900, increment: 10 },
  { name: 'Classical 30+0', duration: 1800, increment: 0 }
];

export const Home = () => {
  const navigate = useNavigate();
  const initGame = useGameStore((state) => state.initGame);
  const stats = useGameStore((state) => state.stats);
  const theme = useGameStore((state) => state.theme);

  // Home State configurations
  const [gameMode, setGameMode] = useState('ai'); // 'ai' or 'pvp'
  const [aiDifficulty, setAiDifficulty] = useState('medium'); // 'easy', 'medium', 'hard', 'expert'
  const [playerColor, setPlayerColor] = useState('w'); // 'w', 'b', or 'random'
  const [selectedTimeControl, setSelectedTimeControl] = useState(TIME_PRESETS[3]); // Default Rapid 10+5

  const [customTime, setCustomTime] = useState(10); // minutes
  const [customInc, setCustomInc] = useState(5); // seconds
  const [isCustomTime, setIsCustomTime] = useState(false);

  // Theme-specific glow classes
  const getGlowTextClass = () => {
    switch (theme) {
      case 'emerald': return 'text-emerald-450 drop-shadow-[0_0_8px_rgba(16,185,129,0.35)]';
      case 'crimson': return 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.35)]';
      case 'gold': return 'text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.35)]';
      default: return 'text-cyber-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]';
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

  const getThemeFocusBorder = () => {
    switch (theme) {
      case 'emerald': return 'focus:border-emerald-500/50';
      case 'crimson': return 'focus:border-red-500/50';
      case 'gold': return 'focus:border-yellow-500/50';
      default: return 'focus:border-cyan-500/50';
    }
  };

  const getBtnActiveBg = () => {
    switch (theme) {
      case 'emerald': return 'border-emerald-500/35 bg-emerald-950/15 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.1)]';
      case 'crimson': return 'border-red-500/35 bg-red-950/15 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.1)]';
      case 'gold': return 'border-yellow-500/35 bg-yellow-950/15 text-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.1)]';
      default: return 'border-cyan-500/35 bg-cyan-950/15 text-cyber-cyan shadow-[0_0_12px_rgba(0,240,255,0.1)]';
    }
  };

  const getLaunchBtnClass = () => {
    switch (theme) {
      case 'emerald': return 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.55)]';
      case 'crimson': return 'bg-red-655 hover:bg-red-500 text-slate-50 shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:shadow-[0_0_30px_rgba(239,68,68,0.55)]';
      case 'gold': return 'bg-yellow-500 hover:bg-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(234,179,8,0.25)] hover:shadow-[0_0_30px_rgba(234,179,8,0.55)]';
      default: return 'bg-cyan-500 hover:bg-cyber-cyan text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:shadow-[0_0_30px_rgba(0,240,255,0.55)]';
    }
  };

  const handleLaunch = () => {
    let finalTimeControl = selectedTimeControl;
    if (isCustomTime) {
      finalTimeControl = {
        name: `${customTime} min + ${customInc}s`,
        duration: customTime * 60,
        increment: parseInt(customInc) || 0
      };
    }

    // Resolve random color selection
    let chosenColor = playerColor;
    if (playerColor === 'random') {
      chosenColor = Math.random() < 0.5 ? 'w' : 'b';
    }

    initGame(gameMode, {
      aiDifficulty,
      playerColor: chosenColor,
      timeControl: finalTimeControl
    });

    navigate('/game');
  };

  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.wins / stats.gamesPlayed) * 100) 
    : 0;

  return (
    <div className="flex-1 flex flex-col gap-6 md:gap-8 overflow-y-auto h-full max-h-full px-5 pt-5 pb-24 md:p-8 cyber-grid max-w-5xl mx-auto w-full">
      {/* Title / Hero */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center md:text-left border-b border-slate-900 pb-5"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-widest uppercase font-mono text-slate-205">
          Combat <span className={getGlowTextClass()}>Console</span>
        </h2>
        <p className="text-slate-500 text-xs mt-1.5 uppercase tracking-wider font-semibold">Configure launch matrix and initialize engagement sequence.</p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Setup Configurator Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 }}
          className="md:col-span-8 rounded-2xl border border-slate-800/80 bg-slate-950/30 p-6 backdrop-blur-xl flex flex-col gap-6.5 relative overflow-hidden"
        >
          <div className="scanner-line" />
          
          {/* Game Mode */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] uppercase text-slate-500 font-bold tracking-widest flex items-center gap-2">
              <Activity className="h-4 w-4" /> Game Mode
            </h3>
            <div className="grid grid-cols-2 gap-3.5">
              <button
                onClick={() => setGameMode('ai')}
                className={`flex flex-col items-center gap-2.5 rounded-xl border p-4.5 text-center transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                  gameMode === 'ai'
                    ? getBtnActiveBg()
                    : 'border-slate-850 bg-slate-900/15 hover:border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <Cpu className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest">VS System AI</span>
              </button>
              <button
                onClick={() => setGameMode('pvp')}
                className={`flex flex-col items-center gap-2.5 rounded-xl border p-4.5 text-center transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                  gameMode === 'pvp'
                    ? getBtnActiveBg()
                    : 'border-slate-850 bg-slate-900/15 hover:border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <User className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Local PvP</span>
              </button>
            </div>
          </div>

          {/* AI Sub-options */}
          {gameMode === 'ai' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex flex-col gap-5 border-t border-slate-900/60 pt-5"
            >
              {/* Difficulty Selection */}
              <div className="flex flex-col gap-3">
                <h3 className="text-[10px] uppercase text-slate-500 font-bold tracking-widest flex items-center gap-2">
                  <Shield className="h-4 w-4" /> AI Evaluation Depth
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {['easy', 'medium', 'hard', 'expert'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setAiDifficulty(d)}
                      className={`py-2.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest text-center transition duration-300 cursor-pointer active:scale-95 ${
                        aiDifficulty === d
                          ? getBtnActiveBg()
                          : 'border-slate-850 bg-slate-900/10 hover:border-slate-800 text-slate-500 hover:text-slate-400'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="flex flex-col gap-3">
                <h3 className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
                  Commander Color Assignment
                </h3>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'w', label: 'White' },
                    { id: 'b', label: 'Black' },
                    { id: 'random', label: 'Randomize' }
                  ].map((colorOpt) => (
                    <button
                      key={colorOpt.id}
                      onClick={() => setPlayerColor(colorOpt.id)}
                      className={`py-2.5 px-3 rounded-lg border text-[10px] font-bold uppercase tracking-widest text-center transition duration-300 cursor-pointer active:scale-95 ${
                        playerColor === colorOpt.id
                          ? getBtnActiveBg()
                          : 'border-slate-850 bg-slate-900/10 hover:border-slate-800 text-slate-500 hover:text-slate-400'
                      }`}
                    >
                      {colorOpt.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Time control */}
          <div className="flex flex-col gap-3 border-t border-slate-900/60 pt-5">
            <h3 className="text-[10px] uppercase text-slate-500 font-bold tracking-widest flex items-center gap-2">
              <Clock className="h-4 w-4" /> Time Protocols
            </h3>
            
            {/* Presets Grid */}
            <div className="grid grid-cols-3 gap-2">
              {TIME_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setSelectedTimeControl(preset);
                    setIsCustomTime(false);
                  }}
                  className={`py-2.5 px-3 rounded-lg border text-[10px] font-mono font-bold tracking-widest text-center transition duration-300 cursor-pointer active:scale-95 ${
                    selectedTimeControl.name === preset.name && !isCustomTime
                      ? getBtnActiveBg()
                      : 'border-slate-850 bg-slate-900/10 hover:border-slate-800 text-slate-500 hover:text-slate-400'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Custom Time trigger */}
            <div className="mt-2">
              <button
                onClick={() => setIsCustomTime(true)}
                className={`w-full py-2.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest text-center transition duration-300 cursor-pointer active:scale-[0.99] ${
                  isCustomTime
                    ? getBtnActiveBg()
                    : 'border-slate-850 bg-slate-900/10 hover:border-slate-800 text-slate-500 hover:text-slate-450'
                }`}
              >
                Custom Configuration Panel
              </button>

              {isCustomTime && (
                <motion.div 
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-4 mt-3.5 p-4 rounded-xl bg-slate-950/40 border border-slate-900"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Base Minutes</label>
                    <input
                      type="number"
                      min="1"
                      max="180"
                      value={customTime}
                      onChange={(e) => setCustomTime(Math.max(1, parseInt(e.target.value) || 1))}
                      className={`bg-slate-900/60 border border-slate-800 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:bg-slate-900 transition-colors ${getThemeTextClass()} ${getThemeFocusBorder()}`}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Increment Seconds</label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={customInc}
                      onChange={(e) => setCustomInc(Math.max(0, parseInt(e.target.value) || 0))}
                      className={`bg-slate-900/60 border border-slate-800 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:bg-slate-900 transition-colors ${getThemeTextClass()} ${getThemeFocusBorder()}`}
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Launch Trigger */}
          <button
            onClick={handleLaunch}
            className={`w-full py-4 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-transparent active:scale-[0.99] cyber-btn ${getLaunchBtnClass()}`}
          >
            <Play className="h-4 w-4 fill-current" />
            Initialize combat sequence
          </button>
        </motion.div>

        {/* Dashboard/Stats Summary Cards */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-slate-800/80 bg-slate-950/30 p-5.5 backdrop-blur-xl flex flex-col gap-3.5 relative overflow-hidden"
          >
            <h3 className="text-[10px] uppercase text-slate-500 font-bold tracking-widest flex items-center gap-2 border-b border-slate-900 pb-2.5">
              <Trophy className="h-4 w-4 text-yellow-500" /> Commander Logs
            </h3>
            
            <div className="flex flex-col gap-3 mt-1">
              <div className="flex justify-between items-center text-xs py-1 border-b border-slate-900/50">
                <span className="text-slate-450 font-medium uppercase tracking-wider text-[10px]">Engagements</span>
                <span className="font-mono text-slate-200 font-bold">{stats.gamesPlayed}</span>
              </div>
              <div className="flex justify-between items-center text-xs py-1 border-b border-slate-900/50">
                <span className="text-slate-450 font-medium uppercase tracking-wider text-[10px]">Wins</span>
                <span className="font-mono text-emerald-400 font-bold">{stats.wins}</span>
              </div>
              <div className="flex justify-between items-center text-xs py-1 border-b border-slate-900/50">
                <span className="text-slate-450 font-medium uppercase tracking-wider text-[10px]">Losses</span>
                <span className="font-mono text-red-450 font-bold">{stats.losses}</span>
              </div>
              <div className="flex justify-between items-center text-xs py-1 border-b border-slate-900/50">
                <span className="text-slate-450 font-medium uppercase tracking-wider text-[10px]">Stalemates</span>
                <span className="font-mono text-slate-400 font-bold">{stats.draws}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-slate-450 font-medium uppercase tracking-wider text-[10px]">Accuracy Coeff.</span>
                <span className={`font-mono font-black ${winRate >= 50 ? 'text-emerald-400' : 'text-yellow-500'}`}>
                  {winRate}%
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22 }}
            className="rounded-2xl border border-slate-800/80 bg-slate-950/30 p-5.5 backdrop-blur-xl flex flex-col gap-3.5 relative overflow-hidden border-dashed"
          >
            <h3 className="text-[10px] uppercase text-slate-500 font-bold tracking-widest flex items-center gap-2 border-b border-slate-900 pb-2.5">
              <Award className={`h-4 w-4 ${getThemeTextClass()}`} /> Operations Manual
            </h3>
            <div className="text-[11px] text-slate-450 flex flex-col gap-2.5 leading-relaxed tracking-wide mt-1">
              <p>• Move commander modules on the coordinate matrix to launch tactical paths.</p>
              <p>• Digital clocks monitor count boundaries. Increment values buffer clocks upon cycles.</p>
              <p>• Advanced strategies leverage Stockfish calculations. Internal engines execute when offline.</p>
              <p>• Open Configuration panel below to calibrate ambient sound structures & layouts.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
