import React from 'react';

// Simplified, clean, futuristic SVG representations for Chess Pieces
// Colored with glowing neon outlines for a high-tech cyberpunk vibe.

const PawnIcon = ({ fill, stroke, glow }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: glow }}>
    <circle cx="50" cy="30" r="12" fill={fill} stroke={stroke} strokeWidth="4" />
    <path d="M 38,50 Q 50,42 62,50 Q 64,75 66,80 L 34,80 Q 36,75 38,50 Z" fill={fill} stroke={stroke} strokeWidth="4" />
    <rect x="30" y="80" width="40" height="6" rx="2" fill={fill} stroke={stroke} strokeWidth="4" />
  </svg>
);

const KnightIcon = ({ fill, stroke, glow }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: glow }}>
    <path d="M 35,80 C 35,80 32,55 42,42 C 42,42 35,40 32,32 C 35,22 48,22 55,25 C 58,22 68,20 72,28 C 76,36 72,45 68,48 C 65,58 60,70 65,80 Z" fill={fill} stroke={stroke} strokeWidth="4" />
    <path d="M 42,42 Q 52,48 55,42" fill="none" stroke={stroke} strokeWidth="4" />
    <circle cx="48" cy="32" r="3" fill={stroke} />
    <rect x="30" y="80" width="40" height="6" rx="2" fill={fill} stroke={stroke} strokeWidth="4" />
  </svg>
);

const BishopIcon = ({ fill, stroke, glow }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: glow }}>
    <circle cx="50" cy="22" r="5" fill={stroke} />
    <path d="M 50,30 C 38,36 38,62 42,76 C 45,78 55,78 58,76 C 62,62 62,36 50,30 Z" fill={fill} stroke={stroke} strokeWidth="4" />
    <path d="M 40,46 Q 50,40 60,46" fill="none" stroke={stroke} strokeWidth="4" />
    <path d="M 50,34 L 50,58" fill="none" stroke={stroke} strokeWidth="4" />
    <path d="M 45,46 L 55,46" fill="none" stroke={stroke} strokeWidth="4" />
    <rect x="32" y="78" width="36" height="6" rx="2" fill={fill} stroke={stroke} strokeWidth="4" />
  </svg>
);

const RookIcon = ({ fill, stroke, glow }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: glow }}>
    <path d="M 36,40 L 64,40 L 62,76 L 38,76 Z" fill={fill} stroke={stroke} strokeWidth="4" />
    <path d="M 32,24 L 32,36 L 40,36 L 40,30 L 48,30 L 48,36 L 52,36 L 52,30 L 60,30 L 60,36 L 68,36 L 68,24 L 62,24 L 62,30 L 56,30 L 56,24 L 44,24 L 44,30 L 38,30 L 38,24 Z" fill={fill} stroke={stroke} strokeWidth="4" />
    <rect x="30" y="78" width="40" height="6" rx="2" fill={fill} stroke={stroke} strokeWidth="4" />
  </svg>
);

const QueenIcon = ({ fill, stroke, glow }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: glow }}>
    <path d="M 30,76 L 70,76 L 75,38 L 60,56 L 50,30 L 40,56 L 25,38 Z" fill={fill} stroke={stroke} strokeWidth="4" />
    <circle cx="25" cy="34" r="3" fill={stroke} />
    <circle cx="40" cy="50" r="3" fill={stroke} />
    <circle cx="50" cy="26" r="3" fill={stroke} />
    <circle cx="60" cy="50" r="3" fill={stroke} />
    <circle cx="75" cy="34" r="3" fill={stroke} />
    <rect x="26" y="78" width="48" height="6" rx="2" fill={fill} stroke={stroke} strokeWidth="4" />
  </svg>
);

const KingIcon = ({ fill, stroke, glow }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: glow }}>
    {/* Crown Cross */}
    <path d="M 50,14 L 50,26 M 44,20 L 56,20" fill="none" stroke={stroke} strokeWidth="4.5" />
    {/* Body */}
    <path d="M 32,76 L 68,76 Q 72,42 62,38 C 60,36 50,42 50,42 C 50,42 40,36 38,38 Q 28,42 32,76 Z" fill={fill} stroke={stroke} strokeWidth="4" />
    <path d="M 38,50 Q 50,56 62,50" fill="none" stroke={stroke} strokeWidth="3" />
    <rect x="26" y="78" width="48" height="6" rx="2" fill={fill} stroke={stroke} strokeWidth="4" />
  </svg>
);

export const ChessPiece = ({ piece, theme }) => {
  const isWhite = piece.startsWith('w');
  const type = piece.charAt(1).toLowerCase();

  // Cyberpunk, Emerald, Crimson, Gold theme colors
  const getThemePalette = () => {
    switch (theme) {
      case 'emerald':
        return {
          fill: isWhite ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
          stroke: isWhite ? '#10b981' : '#f59e0b',
          glow: isWhite 
            ? 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.8))' 
            : 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.8))'
        };
      case 'crimson':
        return {
          fill: isWhite ? 'rgba(239, 68, 68, 0.15)' : 'rgba(148, 163, 184, 0.15)',
          stroke: isWhite ? '#ef4444' : '#cbd5e1',
          glow: isWhite 
            ? 'drop-shadow(0 0 5px rgba(239, 68, 68, 0.8))' 
            : 'drop-shadow(0 0 5px rgba(203, 213, 225, 0.6))'
        };
      case 'gold':
        return {
          fill: isWhite ? 'rgba(234, 179, 8, 0.15)' : 'rgba(249, 115, 22, 0.15)',
          stroke: isWhite ? '#eab308' : '#f97316',
          glow: isWhite 
            ? 'drop-shadow(0 0 5px rgba(234, 179, 8, 0.8))' 
            : 'drop-shadow(0 0 5px rgba(249, 115, 22, 0.8))'
        };
      default:
        // Cyberpunk (Cyan and Purple)
        return {
          fill: isWhite ? 'rgba(0, 240, 255, 0.12)' : 'rgba(189, 0, 255, 0.12)',
          stroke: isWhite ? '#00f0ff' : '#bd00ff',
          glow: isWhite 
            ? 'drop-shadow(0 0 6px rgba(0, 240, 255, 0.9))' 
            : 'drop-shadow(0 0 6px rgba(189, 0, 255, 0.9))'
        };
    }
  };

  const { fill, stroke, glow } = getThemePalette();

  const props = { fill, stroke, glow };

  switch (type) {
    case 'p': return <PawnIcon {...props} />;
    case 'n': return <KnightIcon {...props} />;
    case 'b': return <BishopIcon {...props} />;
    case 'r': return <RookIcon {...props} />;
    case 'q': return <QueenIcon {...props} />;
    case 'k': return <KingIcon {...props} />;
    default: return null;
  }
};

export default ChessPiece;
