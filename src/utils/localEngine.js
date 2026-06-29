// Chess Minimax Engine with Alpha-Beta Pruning & Piece-Square Tables
// Runs client-side for offline fallback or instant local AI moves.

// Piece Square Tables for position evaluations (from White's perspective)
const pawnEval = [
  [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
  [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
  [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
  [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
  [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
  [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
  [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
  [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
];

const knightEval = [
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
  [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
  [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
  [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
  [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
  [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
];

const bishopEval = [
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  [-1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
  [-1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
  [-1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
  [-1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
  [-1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
  [-1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

const rookEval = [
  [ 0.0,  0.0,  0.0,  0.5,  0.5,  0.0,  0.0,  0.0],
  [ 0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
  [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [ 0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

const queenEval = [
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  [-1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
  [-1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
  [-0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
  [ 0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
  [-1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
  [-1.0,  0.0,  0.5,  0.0,  0.0,  0.5,  0.0, -1.0],
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

const kingEval = [
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
  [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
  [ 2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0],
  [ 2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0]
];

// Helper to evaluate static score of a board
const evaluateBoard = (chessGame) => {
  let totalEvaluation = 0;
  const board = chessGame.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const value = getPieceValue(piece, r, c);
        if (piece.color === 'w') {
          totalEvaluation += value;
        } else {
          totalEvaluation -= value;
        }
      }
    }
  }
  return totalEvaluation;
};

// Map piece types to values and add piece-square positioning values
const getPieceValue = (piece, x, y) => {
  let absoluteValue = 0;
  
  // Row indexing reversed for black pieces to reflect symmetrical strategy
  const r = piece.color === 'w' ? x : 7 - x;
  const c = y;

  switch (piece.type) {
    case 'p':
      absoluteValue = 10 + pawnEval[r][c];
      break;
    case 'n':
      absoluteValue = 30 + knightEval[r][c];
      break;
    case 'b':
      absoluteValue = 30 + bishopEval[r][c];
      break;
    case 'r':
      absoluteValue = 50 + rookEval[r][c];
      break;
    case 'q':
      absoluteValue = 90 + queenEval[r][c];
      break;
    case 'k':
      absoluteValue = 9000 + kingEval[r][c];
      break;
    default:
      absoluteValue = 0;
  }
  return absoluteValue;
};

// Minimax with Alpha-Beta Pruning
const minimax = (chessGame, depth, alpha, beta, isMaximizing) => {
  if (depth === 0 || chessGame.isGameOver()) {
    return evaluateBoard(chessGame);
  }

  // Generate legal moves and sort them to improve alpha-beta cutoff rates
  const moves = chessGame.moves({ verbose: true });
  
  // Simple move ordering: captures and checks first
  moves.sort((a, b) => {
    let aVal = 0;
    let bVal = 0;
    if (a.captured) aVal += 10;
    if (b.captured) bVal += 10;
    if (a.san.includes('+')) aVal += 5;
    if (b.san.includes('+')) bVal += 5;
    return bVal - aVal;
  });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chessGame.move(move);
      const evaluation = minimax(chessGame, depth - 1, alpha, beta, false);
      chessGame.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) {
        break; // Beta cutoff
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chessGame.move(move);
      const evaluation = minimax(chessGame, depth - 1, alpha, beta, true);
      chessGame.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) {
        break; // Alpha cutoff
      }
    }
    return minEval;
  }
};

/**
 * Computes the best move for the active player.
 * @param {Chess} chessGame - The current chess.js instance.
 * @param {string} difficulty - 'easy', 'medium', 'hard', 'expert'.
 * @returns {Object} The best move object from chess.js.
 */
export const getBestMoveLocal = (chessGame, difficulty = 'medium') => {
  const moves = chessGame.moves({ verbose: true });
  if (moves.length === 0) return null;

  // 1. Easy Mode: Picks random moves 35% of the time, or search depth 1
  if (difficulty === 'easy') {
    if (Math.random() < 0.35) {
      const randomIndex = Math.floor(Math.random() * moves.length);
      return moves[randomIndex];
    }
  }

  // 2. Map difficulty levels to search depths
  // Keep depths low to guarantee instantaneous response in the browser
  let depth = 2; // Default Medium
  if (difficulty === 'easy') depth = 1;
  else if (difficulty === 'medium') depth = 2;
  else if (difficulty === 'hard') depth = 3;
  else if (difficulty === 'expert') depth = 3; // Depth 3 is fast (< 150ms) and plays very solid chess

  const activeColor = chessGame.turn(); // 'w' or 'b'
  const isMaximizing = activeColor === 'w';

  let bestMove = null;
  let bestValue = isMaximizing ? -Infinity : Infinity;
  let alpha = -Infinity;
  let beta = Infinity;

  // Simple move ordering
  moves.sort((a, b) => {
    let aVal = 0;
    let bVal = 0;
    if (a.captured) aVal += 10;
    if (b.captured) bVal += 10;
    if (a.san.includes('+')) aVal += 5;
    if (b.san.includes('+')) bVal += 5;
    return bVal - aVal;
  });

  for (const move of moves) {
    chessGame.move(move);
    const boardVal = minimax(chessGame, depth - 1, alpha, beta, !isMaximizing);
    chessGame.undo();

    if (isMaximizing) {
      if (boardVal > bestValue) {
        bestValue = boardVal;
        bestMove = move;
      }
      alpha = Math.max(alpha, boardVal);
    } else {
      if (boardVal < bestValue) {
        bestValue = boardVal;
        bestMove = move;
      }
      beta = Math.min(beta, boardVal);
    }
  }

  // If search returned nothing (safety check), pick the first legal move
  return bestMove || moves[0];
};
