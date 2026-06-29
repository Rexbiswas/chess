import { useState } from 'react';
import { useGameStore } from '../hooks/useGameStore';
import { 
  RotateCcw, 
  Flag, 
  Undo2, 
  RefreshCw, 
  Copy, 
  Download, 
  Upload,
  Check
} from 'lucide-react';
import { Chess } from 'chess.js';

export const GameControls = ({ onOpenImportModal }) => {
  const {
    fen,
    history,
    gameMode,
    status,
    undoMove,
    resignGame,
    initGame,
    toggleBoardFlip,
    theme
  } = useGameStore();

  const [copiedFen, setCopiedFen] = useState(false);
  const [copiedPgn, setCopiedPgn] = useState(false);

  const isPlaying = status === 'playing';

  const handleCopyFen = () => {
    navigator.clipboard.writeText(fen);
    setCopiedFen(true);
    setTimeout(() => setCopiedFen(false), 2000);
  };

  const getPgnString = () => {
    const tempChess = new Chess();
    // Play all moves sequentially
    for (const move of history) {
      try {
        tempChess.move(move.san);
      } catch (err) {
        // Fallback for complex promotions or imports
        tempChess.move({ from: move.from, to: move.to, promotion: move.promotion });
      }
    }
    return tempChess.pgn();
  };

  const handleCopyPgn = () => {
    const pgn = getPgnString();
    navigator.clipboard.writeText(pgn || '1. ');
    setCopiedPgn(true);
    setTimeout(() => setCopiedPgn(false), 2000);
  };

  const handleDownloadPgn = () => {
    const pgn = getPgnString();
    const element = document.createElement('a');
    const file = new Blob([pgn || ''], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `chess_match_${new Date().toISOString().slice(0,10)}.pgn`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRestart = () => {
    if (isPlaying) {
      if (window.confirm("Are you sure you want to restart? This game's progress will be lost.")) {
        initGame();
      }
    } else {
      initGame();
    }
  };

  const handleResign = () => {
    if (isPlaying) {
      if (window.confirm("Are you sure you want to resign this match?")) {
        resignGame();
      }
    }
  };

  const getThemeTextClass = () => {
    switch (theme) {
      case 'emerald': return 'text-emerald-400';
      case 'crimson': return 'text-red-400';
      case 'gold': return 'text-yellow-400';
      default: return 'text-cyan-400';
    }
  };

  const getThemeBtnClass = (active = true) => {
    const base = "cyber-btn flex items-center justify-center gap-2 rounded-xl border bg-slate-900/60 text-slate-200 py-3 text-xs font-bold transition duration-300 ";
    if (!active) {
      return base + "border-slate-900 bg-slate-950/20 text-slate-500 opacity-40 cursor-not-allowed pointer-events-none";
    }
    
    switch (theme) {
      case 'emerald': return base + "border-slate-850 hover:border-emerald-500/40 hover:bg-emerald-950/15 hover:text-emerald-400 cursor-pointer";
      case 'crimson': return base + "border-slate-850 hover:border-red-500/40 hover:bg-red-950/15 hover:text-red-400 cursor-pointer";
      case 'gold': return base + "border-slate-850 hover:border-yellow-500/40 hover:bg-yellow-950/15 hover:text-yellow-400 cursor-pointer";
      default: return base + "border-slate-850 hover:border-cyan-500/40 hover:bg-cyan-950/15 hover:text-cyber-cyan cursor-pointer";
    }
  };

  return (
    <div className="flex flex-col gap-3.5 rounded-2xl border border-slate-800/80 bg-slate-950/30 p-4.5 backdrop-blur-xl">
      {/* Game Actions */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={handleRestart}
          className={getThemeBtnClass(true)}
        >
          <RotateCcw className={`h-4 w-4 ${getThemeTextClass()}`} />
          Restart
        </button>

        <button
          onClick={handleResign}
          disabled={!isPlaying}
          className={`cyber-btn flex items-center justify-center gap-2 rounded-xl bg-slate-900/60 border text-slate-200 py-3 text-xs font-bold transition duration-300 ${
            isPlaying 
              ? 'border-slate-850 hover:border-red-500/40 hover:bg-red-950/15 hover:text-red-400 cursor-pointer' 
              : 'border-slate-900 bg-slate-950/20 text-slate-500 opacity-40 cursor-not-allowed'
          }`}
        >
          <Flag className="h-4 w-4 text-red-500" />
          Resign
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={undoMove}
          disabled={history.length === 0 || !isPlaying}
          className={getThemeBtnClass(history.length > 0 && isPlaying)}
        >
          <Undo2 className="h-4 w-4 text-purple-400" />
          Undo Move
        </button>

        <button
          onClick={toggleBoardFlip}
          className={getThemeBtnClass(true)}
        >
          <RefreshCw className="h-4 w-4 text-yellow-500" />
          Flip Board
        </button>
      </div>

      {/* Import/Export Dividers */}
      <div className="h-px bg-slate-900/60 my-1" />

      {/* Share / Save operations */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
          <span>Data Integration</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* FEN Copy */}
          <button
            onClick={handleCopyFen}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900/40 border border-slate-850 hover:bg-slate-900/80 hover:border-slate-800 text-slate-350 py-2.5 text-[10px] font-bold tracking-wider uppercase transition cursor-pointer active:scale-95"
          >
            {copiedFen ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-450" />
                <span className="text-emerald-450">Copied FEN</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy FEN</span>
              </>
            )}
          </button>

          {/* Import FEN */}
          <button
            onClick={onOpenImportModal}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900/40 border border-slate-850 hover:bg-slate-900/80 hover:border-slate-800 text-slate-350 py-2.5 text-[10px] font-bold tracking-wider uppercase transition cursor-pointer active:scale-95"
          >
            <Upload className="h-3.5 w-3.5 text-slate-500" />
            <span>Import FEN</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Copy PGN */}
          <button
            onClick={handleCopyPgn}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900/40 border border-slate-850 hover:bg-slate-900/80 hover:border-slate-800 text-slate-350 py-2.5 text-[10px] font-bold tracking-wider uppercase transition cursor-pointer active:scale-95"
          >
            {copiedPgn ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-450" />
                <span className="text-emerald-450">Copied PGN</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy PGN</span>
              </>
            )}
          </button>

          {/* Download PGN */}
          <button
            onClick={handleDownloadPgn}
            disabled={history.length === 0}
            className={`flex items-center justify-center gap-1.5 rounded-xl bg-slate-900/40 border py-2.5 text-[10px] font-bold tracking-wider uppercase transition active:scale-95 ${
              history.length > 0 
                ? 'border-slate-850 hover:bg-slate-900/80 hover:border-slate-800 text-slate-350 cursor-pointer' 
                : 'border-slate-900 bg-slate-950/20 text-slate-600 opacity-40 cursor-not-allowed'
            }`}
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export PGN</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
