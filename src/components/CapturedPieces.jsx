import { useGameStore } from '../hooks/useGameStore';

const PIECE_SYMBOLS = {
  p: '♟',
  n: '♞',
  b: '♝',
  r: '♜',
  q: '♛'
};

const PIECE_ORDER = { q: 1, r: 2, b: 3, n: 4, p: 5 };

export const CapturedPieces = ({ color }) => {
  const capturedList = useGameStore((state) => state.captured[color]);
  const materialDiff = useGameStore((state) => state.materialDiff);
  const theme = useGameStore((state) => state.theme);

  // Sort pieces by rank/value (Q, R, B, N, P)
  const sortedPieces = [...capturedList].sort((a, b) => PIECE_ORDER[a.type] - PIECE_ORDER[b.type]);

  // Glow color depending on piece color
  const getPieceColorClass = (pieceColor) => {
    if (theme === 'emerald') {
      return pieceColor === 'w' ? 'text-emerald-400 drop-shadow-[0_0_4px_#10b981]' : 'text-amber-500 drop-shadow-[0_0_4px_#f59e0b]';
    } else if (theme === 'crimson') {
      return pieceColor === 'w' ? 'text-red-400 drop-shadow-[0_0_4px_#ef4444]' : 'text-slate-400 drop-shadow-[0_0_4px_#cbd5e1]';
    } else if (theme === 'gold') {
      return pieceColor === 'w' ? 'text-yellow-400 drop-shadow-[0_0_4px_#eab308]' : 'text-orange-500 drop-shadow-[0_0_4px_#f97316]';
    } else {
      // Cyberpunk (Default)
      return pieceColor === 'w' ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(0,240,255,0.7)]' : 'text-purple-400 drop-shadow-[0_0_5px_rgba(189,0,255,0.7)]';
    }
  };

  const isAdvantage = (color === 'w' && materialDiff > 0) || (color === 'b' && materialDiff < 0);
  const absDiff = Math.abs(materialDiff);

  return (
    <div className="flex h-8 items-center gap-2 rounded-xl bg-slate-950/60 px-3 py-1 text-xs border border-slate-900/60 backdrop-blur-md">
      <span className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">
        Captured:
      </span>
      <div className="flex items-center gap-1.5 overflow-hidden max-w-[120px] md:max-w-none">
        {sortedPieces.length > 0 ? (
          sortedPieces.map((piece, idx) => (
            <span
              key={idx}
              className={`text-base transition-all duration-300 ${getPieceColorClass(piece.color)}`}
            >
              {PIECE_SYMBOLS[piece.type]}
            </span>
          ))
        ) : (
          <span className="text-[10px] text-slate-650 italic tracking-wide">None</span>
        )}
      </div>
      {isAdvantage && (
        <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-black text-emerald-400 border border-emerald-500/20 ml-1">
          +{absDiff}
        </span>
      )}
    </div>
  );
};

export default CapturedPieces;
