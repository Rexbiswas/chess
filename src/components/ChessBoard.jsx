import { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { useGameStore } from '../hooks/useGameStore';
import { Chess } from 'chess.js';
import ChessPiece from './ChessPiece';
import { Cpu } from 'lucide-react';

export const ChessBoard = () => {
  const {
    fen,
    highlightSquares,
    boardFlipped,
    theme,
    pieceStyle,
    status,
    isAiThinking,
    makeMove,
    gameMode,
    playerColor
  } = useGameStore();

  const [pendingMove, setPendingMove] = useState(null);

  const isPlaying = status === 'playing';

  // Check if a move is a promotion
  const checkPromotion = (source, target) => {
    const tempChess = new Chess(fen);
    const moves = tempChess.moves({ verbose: true });
    
    // Find if any legal move from source to target has a promotion property
    return moves.some(
      (m) => m.from === source && m.to === target && m.promotion
    );
  };

  const onDrop = (sourceSquare, targetSquare) => {
    if (!isPlaying || isAiThinking) return false;

    // Check if turn matches player in AI mode
    const tempChess = new Chess(fen);
    if (gameMode === 'ai' && tempChess.turn() !== playerColor) return false;

    // Check for promotion
    const isPromotion = checkPromotion(sourceSquare, targetSquare);
    if (isPromotion) {
      setPendingMove({ from: sourceSquare, to: targetSquare });
      return true; // Keep piece on board visually until selected
    }

    // Attempt regular move
    const success = makeMove({
      from: sourceSquare,
      to: targetSquare
    });
    return success;
  };

  const handlePromotionSelect = (pieceChar) => {
    if (pendingMove) {
      makeMove({
        from: pendingMove.from,
        to: pendingMove.to,
        promotion: pieceChar
      });
      setPendingMove(null);
    }
  };

  // Build custom pieces object if 'neo' is selected
  const customPieces = {};
  if (pieceStyle === 'neo') {
    const pieceTypes = ['wP', 'wN', 'wB', 'wR', 'wQ', 'wK', 'bP', 'bN', 'bB', 'bR', 'bQ', 'bK'];
    pieceTypes.forEach((p) => {
      customPieces[p] = ({ squareWidth }) => (
        <div style={{ width: squareWidth, height: squareWidth }} className="p-0.5">
          <ChessPiece piece={p} theme={theme} />
        </div>
      );
    });
  }

  // Get square colors depending on active theme
  const getSquareStyles = () => {
    switch (theme) {
      case 'emerald':
        return {
          dark: '#0d221b',
          light: '#1e4b3c'
        };
      case 'crimson':
        return {
          dark: '#1b0c0c',
          light: '#3c1818'
        };
      case 'gold':
        return {
          dark: '#171512',
          light: '#423722'
        };
      default:
        // Cyberpunk (Default)
        return {
          dark: '#06070f',
          light: '#131528'
        };
    }
  };

  const squareColors = getSquareStyles();

  // Get outer board glow style class
  const getBoardGlowClass = () => {
    switch (theme) {
      case 'emerald': return 'board-glow-emerald';
      case 'crimson': return 'board-glow-crimson';
      case 'gold': return 'board-glow-gold';
      default: return 'board-glow-cyberpunk';
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

  const getThemeBorderGlow = () => {
    switch (theme) {
      case 'emerald': return 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] text-emerald-450';
      case 'crimson': return 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] text-red-400';
      case 'gold': return 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)] text-yellow-400';
      default: return 'border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.2)] text-cyber-cyan';
    }
  };

  const promotionPieces = [
    { type: 'q', label: '♛ Queen' },
    { type: 'n', label: '♞ Knight' },
    { type: 'r', label: '♜ Rook' },
    { type: 'b', label: '♝ Bishop' }
  ];

  return (
    <div className="relative w-full max-w-[560px] aspect-square mx-auto">
      {/* Board Wrapper with glows */}
      <div className={`w-full h-full rounded-2xl overflow-hidden transition-all duration-500 ${getBoardGlowClass()}`}>
        <Chessboard
          position={fen}
          onPieceDrop={onDrop}
          boardOrientation={boardFlipped ? 'black' : 'white'}
          customDarkSquareStyle={{ backgroundColor: squareColors.dark }}
          customLightSquareStyle={{ backgroundColor: squareColors.light }}
          darkSquareStyle={{ backgroundColor: squareColors.dark }}
          lightSquareStyle={{ backgroundColor: squareColors.light }}
          customSquareStyles={highlightSquares}
          customPieces={pieceStyle === 'neo' ? customPieces : undefined}
          arePiecesDraggable={isPlaying && !isAiThinking}
          animationDuration={300}
        />
      </div>

      {/* AI Calculating Overlay */}
      {isAiThinking && (
        <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[1px] flex items-center justify-center pointer-events-none rounded-2xl">
          <div className={`flex items-center gap-2.5 px-4.5 py-2.5 rounded-full bg-slate-950/95 border ${getThemeBorderGlow()} animate-pulse`}>
            <Cpu className="h-4 w-4 animate-spin" />
            <span className="text-[10px] font-mono font-black tracking-widest uppercase">
              AI Analyzing Matrix...
            </span>
          </div>
        </div>
      )}

      {/* Pawn Promotion Overlay */}
      {pendingMove && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center z-30 rounded-2xl p-6">
          <div className="text-center mb-6">
            <h4 className={`text-base font-black uppercase tracking-widest font-mono ${getThemeTextClass()}`}>
              Pawn Upgrade Code
            </h4>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Select upgrade module for your pawn</p>
          </div>
          <div className="grid grid-cols-2 gap-3.5 w-full max-w-xs">
            {promotionPieces.map((p) => (
              <button
                key={p.type}
                onClick={() => handlePromotionSelect(p.type)}
                className="py-3.5 px-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-600/80 hover:bg-slate-900 hover:text-slate-100 font-bold transition flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider cyber-btn"
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPendingMove(null)}
            className="mt-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-350 underline cursor-pointer"
          >
            Cancel Upgrade
          </button>
        </div>
      )}
    </div>
  );
};

export default ChessBoard;
