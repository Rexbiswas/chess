import { useState, useEffect } from 'react';
import { useGameStore } from '../hooks/useGameStore';
import { ChessBoard } from '../components/ChessBoard';
import { Timer } from '../components/Timer';
import { CapturedPieces } from '../components/CapturedPieces';
import { MoveHistory } from '../components/MoveHistory';
import { GameControls } from '../components/GameControls';
import { Modal } from '../components/Modal';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Cpu, User, Play, Award } from 'lucide-react';
import { Chess } from 'chess.js';

export const Game = () => {
  const {
    status,
    winner,
    gameMode,
    playerColor,
    aiDifficulty,
    initGame,
    importFen,
    fen,
    theme
  } = useGameStore();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [fenInput, setFenInput] = useState('');
  const [importError, setImportError] = useState(false);

  // Trigger celebration on Victory
  useEffect(() => {
    if (status === 'checkmate') {
      const chess = new Chess(fen);
      const gameWinner = chess.turn() === 'w' ? 'b' : 'w';
      
      // If AI mode and player won, OR PvP mode
      if ((gameMode === 'ai' && gameWinner === playerColor) || gameMode === 'pvp') {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.65 }
        });
      }
    }
  }, [status, winner, gameMode, playerColor, fen]);

  const handleImportSubmit = (e) => {
    e.preventDefault();
    setImportError(false);
    
    if (fenInput.trim()) {
      const success = importFen(fenInput.trim());
      if (success) {
        setIsImportModalOpen(false);
        setFenInput('');
      } else {
        setImportError(true);
      }
    }
  };

  const getEndingMessage = () => {
    if (status === 'checkmate') {
      if (gameMode === 'ai') {
        return winner === playerColor 
          ? 'Victory! Tactical opponent neutralized.' 
          : 'Defeat. System tactical dominance achieved.';
      }
      return `Checkmate! ${winner === 'w' ? 'White' : 'Black'} claims total dominance.`;
    }
    if (status === 'stalemate') {
      return 'Stalemate. Tactical gridlock reached.';
    }
    if (status === 'timeout') {
      const winnerName = winner === 'w' ? 'White' : 'Black';
      return `Timeout! Clock expired. Winner: ${winnerName}.`;
    }
    if (status === 'resigned') {
      const resigner = winner === 'w' ? 'Black' : 'White';
      const winnerName = winner === 'w' ? 'White' : 'Black';
      return `${resigner} surrendered. Winner: ${winnerName}.`;
    }
    if (status === 'draw') {
      return 'Draw. Balance restored to the grid.';
    }
    return '';
  };

  const getOpponentLabel = () => {
    if (gameMode === 'ai') {
      return `Stockfish AI (${aiDifficulty.toUpperCase()})`;
    }
    return playerColor === 'w' ? 'Opponent (Black)' : 'Opponent (White)';
  };

  const getPlayerLabel = () => {
    if (gameMode === 'ai') {
      return playerColor === 'w' ? 'Commander (White)' : 'Commander (Black)';
    }
    return playerColor === 'w' ? 'Commander (White)' : 'Commander (Black)';
  };

  const getThemeTextGlow = () => {
    switch (theme) {
      case 'emerald': return 'text-emerald-450 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]';
      case 'crimson': return 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]';
      case 'gold': return 'text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]';
      default: return 'text-cyber-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]';
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

  const getThemeFocusBorder = () => {
    switch (theme) {
      case 'emerald': return 'focus:border-emerald-500/50';
      case 'crimson': return 'focus:border-red-500/50';
      case 'gold': return 'focus:border-yellow-500/50';
      default: return 'focus:border-cyan-500/50';
    }
  };

  const getThemeLaunchBtn = () => {
    switch (theme) {
      case 'emerald': return 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.25)]';
      case 'crimson': return 'bg-red-600 hover:bg-red-500 text-slate-50 shadow-[0_0_20px_rgba(239,68,68,0.25)]';
      case 'gold': return 'bg-yellow-500 hover:bg-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(234,179,8,0.25)]';
      default: return 'bg-cyan-500 hover:bg-cyber-cyan text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.25)]';
    }
  };

  const opponentColor = playerColor === 'w' ? 'b' : 'w';

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 px-5 pt-5 pb-24 md:p-6 overflow-y-auto max-w-6xl mx-auto w-full items-stretch cyber-grid">
      
      {/* LEFT: Chessboard Arena */}
      <div className="flex-1 flex flex-col justify-center gap-4.5 max-w-[560px] mx-auto w-full">
        
        {/* Opponent Card Header */}
        <div className="flex items-center justify-between gap-4 bg-slate-950/20 p-3.5 rounded-2xl border border-slate-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-slate-900 border border-slate-800">
              {gameMode === 'ai' ? (
                <Cpu className="h-4.5 w-4.5 text-purple-400" />
              ) : (
                <User className="h-4.5 w-4.5 text-purple-400" />
              )}
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-200 tracking-wide uppercase font-mono">{getOpponentLabel()}</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Tactical Opponent</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <CapturedPieces color={opponentColor} />
            <Timer color={opponentColor} />
          </div>
        </div>

        {/* Central Chessboard */}
        <ChessBoard />

        {/* Player Card Header */}
        <div className="flex items-center justify-between gap-4 bg-slate-950/20 p-3.5 rounded-2xl border border-slate-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-slate-900 border border-slate-800">
              <User className={`h-4.5 w-4.5 ${getThemeTextClass()}`} />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-200 tracking-wide uppercase font-mono">{getPlayerLabel()}</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Active Commander</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <CapturedPieces color={playerColor} />
            <Timer color={playerColor} />
          </div>
        </div>
      </div>

      {/* RIGHT: Game Dashboard Logs & controls */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col gap-4 shrink-0 justify-between">
        <GameControls onOpenImportModal={() => setIsImportModalOpen(true)} />
        <div className="flex-1 min-h-[220px]">
          <MoveHistory />
        </div>
      </div>

      {/* Game Over Screen Modal */}
      <Modal
        isOpen={status !== 'playing' && status !== 'paused' && status !== 'idle'}
        onClose={() => initGame()}
        title="Tactical Summary"
      >
        <div className="flex flex-col items-center justify-center text-center p-4">
          <div className="rounded-2xl bg-slate-950 p-4 border border-slate-900 mb-4 shadow-inner">
            <Award className={`h-11 w-11 ${getThemeTextGlow()}`} />
          </div>
          <h4 className="text-xl font-black tracking-widest uppercase font-mono text-slate-100">
            Engagement Concluded
          </h4>
          <p className="text-xs text-slate-455 mt-2.5 font-bold tracking-wider uppercase leading-relaxed max-w-xs">
            {getEndingMessage()}
          </p>

          <div className="h-px bg-slate-900 w-full my-6" />

          <button
            onClick={() => initGame()}
            className={`cyber-btn w-full py-4 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition duration-300 flex items-center justify-center gap-2 cursor-pointer ${getThemeLaunchBtn()}`}
          >
            <Play className="h-4 w-4 fill-current" />
            Initiate Next Match
          </button>
        </div>
      </Modal>

      {/* Import FEN Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setFenInput('');
          setImportError(false);
        }}
        title="Import Position Matrix"
      >
        <form onSubmit={handleImportSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
              Paste FEN String
            </label>
            <input
              type="text"
              placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
              value={fenInput}
              onChange={(e) => setFenInput(e.target.value)}
              className={`bg-slate-950/60 border border-slate-800 rounded-xl py-3 px-4 text-xs font-mono focus:outline-none focus:bg-slate-950 transition-colors w-full ${getThemeTextClass()} ${getThemeFocusBorder()}`}
            />
            {importError && (
              <span className="text-[10px] text-red-500 font-black tracking-widest uppercase mt-1.5">
                ERROR: FEN Matrix string rejected as invalid.
              </span>
            )}
          </div>

          <div className="flex gap-3 justify-end mt-2 border-t border-slate-900 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsImportModalOpen(false);
                setFenInput('');
                setImportError(false);
              }}
              className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-350"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition cursor-pointer cyber-btn ${getThemeLaunchBtn()}`}
            >
              Load Matrix
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Game;
