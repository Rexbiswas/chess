// Stockfish Online API Integration Utility
// Integrates stockfish.online API for expert evaluations and falls back to local minimax when offline.

import { getBestMoveLocal } from './localEngine';

/**
 * Maps game difficulty settings to Stockfish depth levels.
 * Easy/Medium will use local engine to avoid network lag, while Hard/Expert use Stockfish API.
 */
const DIFFICULTY_DEPTHS = {
  easy: 3,
  medium: 6,
  hard: 10,
  expert: 13
};

/**
 * Fetch the best move from the stockfish.online API.
 * Falls back to local engine on network failure, timeout, or rate-limiting.
 * 
 * @param {Object} chessGame - Current chess.js instance.
 * @param {string} difficulty - 'easy', 'medium', 'hard', 'expert'.
 * @returns {Promise<Object>} A move description object { from, to, promotion } compatible with chess.js.
 */
export const getBestMove = async (chessGame, difficulty = 'medium') => {
  // For Easy and Medium, our local engine is fast, doesn't need network, and plays at a suitable strength
  if (difficulty === 'easy' || difficulty === 'medium') {
    return new Promise((resolve) => {
      // Small simulated delay (300-600ms) to make the AI feel "thoughtful" instead of instantaneous
      setTimeout(() => {
        const localMove = getBestMoveLocal(chessGame, difficulty);
        resolve({
          from: localMove.from,
          to: localMove.to,
          promotion: localMove.promotion || undefined
        });
      }, 500 + Math.random() * 300);
    });
  }

  const fen = chessGame.fen();
  const depth = DIFFICULTY_DEPTHS[difficulty] || 10;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout

  try {
    const url = `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(fen)}&depth=${depth}`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API response status: ${response.status}`);
    }

    const data = await response.json();
    if (data.success && data.bestmove) {
      // Format of bestmove is: "bestmove e2e4 ponder..."
      const parts = data.bestmove.split(' ');
      const moveStr = parts[1]; // e.g., "e2e4" or "e7e8q"
      
      if (moveStr && moveStr.length >= 4) {
        const from = moveStr.substring(0, 2);
        const to = moveStr.substring(2, 4);
        const promotion = moveStr.length === 5 ? moveStr.charAt(4) : undefined;
        
        return { from, to, promotion };
      }
    }
    throw new Error("Invalid or empty response from Stockfish API");
  } catch (error) {
    console.warn("Stockfish API failed. Falling back to local Minimax engine.", error.message);
    clearTimeout(timeoutId);
    
    // Fall back to local minimax evaluator
    return new Promise((resolve) => {
      const localMove = getBestMoveLocal(chessGame, difficulty);
      resolve({
        from: localMove.from,
        to: localMove.to,
        promotion: localMove.promotion || undefined
      });
    });
  }
};
