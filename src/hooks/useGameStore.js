// Zustand Store for Chess Game State
// Handles all game conditions, timer cycles, themes, history, and stats.

import { create } from 'zustand';
import { Chess } from 'chess.js';
import { getBestMove } from '../utils/stockfishApi';
import { soundEffects } from '../utils/soundEffects';

// Helper to compute captured pieces dynamically from FEN
const calculateCapturedPieces = (chessInstance) => {
  const starting = {
    w: { p: 8, n: 2, b: 2, r: 2, q: 1 },
    b: { p: 8, n: 2, b: 2, r: 2, q: 1 }
  };
  
  const current = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0 }
  };
  
  const board = chessInstance.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.type !== 'k') {
        current[piece.color][piece.type]++;
      }
    }
  }
  
  const capturedByWhite = []; // Black pieces captured by White
  const capturedByBlack = []; // White pieces captured by Black
  
  // Calculate missing Black pieces
  Object.keys(starting.b).forEach(type => {
    const diff = starting.b[type] - current.b[type];
    for (let i = 0; i < diff; i++) {
      capturedByWhite.push({ type, color: 'b' });
    }
  });

  // Calculate missing White pieces
  Object.keys(starting.w).forEach(type => {
    const diff = starting.w[type] - current.w[type];
    for (let i = 0; i < diff; i++) {
      capturedByBlack.push({ type, color: 'w' });
    }
  });

  return {
    w: capturedByWhite, // Black pieces captured by White (White's collection)
    b: capturedByBlack  // White pieces captured by Black (Black's collection)
  };
};

// Helper to compute material scores
const getMaterialDifference = (captured) => {
  const values = { p: 1, n: 3, b: 3, r: 5, q: 9 };
  const whiteTotal = captured.w.reduce((sum, p) => sum + values[p.type], 0);
  const blackTotal = captured.b.reduce((sum, p) => sum + values[p.type], 0);
  return whiteTotal - blackTotal; // Positive means white is up, negative means black
};

// Default Configurations
const DEFAULT_THEME = 'cyberpunk';
const DEFAULT_PIECE_STYLE = 'neo';

export const useGameStore = create((set, get) => ({
  // Game Configuration
  gameMode: 'ai', // 'pvp' or 'ai'
  aiDifficulty: 'medium', // 'easy', 'medium', 'hard', 'expert'
  playerColor: 'w', // 'w' or 'b' (for 'ai' mode)
  
  // Timer & Clock Settings
  timeControl: { name: '10 min + 5s', duration: 600, increment: 5 }, // duration in seconds
  clocks: { w: 600, b: 600 },
  timerIntervalId: null,

  // Board State
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  history: [],
  captured: { w: [], b: [] },
  materialDiff: 0,
  boardFlipped: false,
  highlightSquares: {}, // Custom square styles for last move, checks
  
  // Game Status
  status: 'idle', // 'idle', 'playing', 'paused', 'checkmate', 'stalemate', 'draw', 'resigned', 'timeout'
  winner: null, // 'w', 'b', or 'draw'
  isAiThinking: false,

  // Global Settings
  theme: localStorage.getItem('chess_theme') || DEFAULT_THEME,
  pieceStyle: localStorage.getItem('chess_pieceStyle') || localStorage.getItem('chess_piece_style') || DEFAULT_PIECE_STYLE,
  soundMuted: JSON.parse(localStorage.getItem('chess_soundMuted') || localStorage.getItem('chess_muted') || 'false'),

  // Statistics
  stats: JSON.parse(localStorage.getItem('chess_stats')) || {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    movesCount: 0
  },

  // Actions
  updateSetting: (key, value) => {
    localStorage.setItem(`chess_${key}`, typeof value === 'object' ? JSON.stringify(value) : value);
    if (key === 'soundMuted') {
      soundEffects.setMuted(value);
    }
    set({ [key]: value });
  },

  resetStats: () => {
    const freshStats = { gamesPlayed: 0, wins: 0, losses: 0, draws: 0, movesCount: 0 };
    localStorage.setItem('chess_stats', JSON.stringify(freshStats));
    set({ stats: freshStats });
  },

  setBoardFlipped: (flipped) => {
    set({ boardFlipped: flipped });
  },

  toggleBoardFlip: () => {
    set((state) => ({ boardFlipped: !state.boardFlipped }));
  },

  // Setup a new game
  initGame: (mode, config = {}) => {
    const { aiDifficulty, playerColor, timeControl } = config;
    const modeSelected = mode || get().gameMode;
    const diff = aiDifficulty || get().aiDifficulty;
    const pColor = playerColor || get().playerColor;
    const tc = timeControl || get().timeControl;

    // Clear existing timer intervals
    const currentInterval = get().timerIntervalId;
    if (currentInterval) clearInterval(currentInterval);

    // Initial Sound
    soundEffects.init();
    
    set({
      gameMode: modeSelected,
      aiDifficulty: diff,
      playerColor: pColor,
      timeControl: tc,
      clocks: { w: tc.duration, b: tc.duration },
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      history: [],
      captured: { w: [], b: [] },
      materialDiff: 0,
      boardFlipped: pColor === 'b',
      highlightSquares: {},
      status: 'playing',
      winner: null,
      isAiThinking: false,
      timerIntervalId: null
    });

    get().startTimer();

    // Trigger AI's move if player starts as black in AI mode
    if (modeSelected === 'ai' && pColor === 'b') {
      get().triggerAiMove();
    }
  },

  // Start the chess clock ticking
  startTimer: () => {
    // Clear any existing timer
    const prevInterval = get().timerIntervalId;
    if (prevInterval) clearInterval(prevInterval);

    const interval = setInterval(() => {
      const { status, fen, clocks } = get();
      if (status !== 'playing') return;

      const chess = new Chess(fen);
      const activeColor = chess.turn(); // 'w' or 'b'
      const activeClock = clocks[activeColor];

      if (activeClock <= 1) {
        // Time Over!
        clearInterval(get().timerIntervalId);
        const opponent = activeColor === 'w' ? 'b' : 'w';
        
        soundEffects.playDefeat();
        
        // Log Statistics
        get().recordGameResult(opponent, 'timeout');
        
        set({
          clocks: { ...clocks, [activeColor]: 0 },
          status: 'timeout',
          winner: opponent
        });
      } else {
        // Play tick sound when time is short (less than 15 seconds)
        if (activeClock <= 15) {
          soundEffects.playTick();
        }

        set((state) => ({
          clocks: {
            ...state.clocks,
            [activeColor]: activeClock - 1
          }
        }));
      }
    }, 1000);

    set({ timerIntervalId: interval });
  },

  pauseGame: () => {
    if (get().status === 'playing') {
      set({ status: 'paused' });
    }
  },

  resumeGame: () => {
    if (get().status === 'paused') {
      set({ status: 'playing' });
      get().startTimer();
    }
  },

  resignGame: () => {
    const { status, fen, playerColor, gameMode } = get();
    if (status !== 'playing' && status !== 'paused') return;

    const chess = new Chess(fen);
    const activeTurn = chess.turn();
    const opponent = activeTurn === 'w' ? 'b' : 'w';

    // Clear timer
    const currentInterval = get().timerIntervalId;
    if (currentInterval) clearInterval(currentInterval);

    soundEffects.playDefeat();

    // Stats updates
    if (gameMode === 'ai') {
      get().recordGameResult(playerColor === 'w' ? 'b' : 'w', 'resigned');
    } else {
      get().recordGameResult(opponent, 'resigned');
    }

    set({
      status: 'resigned',
      winner: gameMode === 'ai' ? (playerColor === 'w' ? 'b' : 'w') : opponent
    });
  },

  // Perform a legal move
  makeMove: (moveData) => {
    const { fen, status, isAiThinking, gameMode, playerColor, clocks, timeControl } = get();
    if (status !== 'playing' || isAiThinking) return false;

    const chess = new Chess(fen);
    const currentTurn = chess.turn();

    // Restrict moves to player's turn in AI mode
    if (gameMode === 'ai' && currentTurn !== playerColor) return false;

    try {
      const move = chess.move(moveData);
      if (move) {
        // Play appropriate sound effect
        if (chess.isCheck()) {
          soundEffects.playCheck();
        } else if (move.captured) {
          soundEffects.playCapture();
        } else {
          soundEffects.playMove();
        }

        // Apply Time Increment if active
        let newClocks = { ...clocks };
        if (timeControl.increment > 0) {
          newClocks[currentTurn] = clocks[currentTurn] + timeControl.increment;
        }

        // Generate highlight styles for the last move
        const newHighlights = {
          [move.from]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
          [move.to]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' }
        };

        // Red highlighting for King in check
        if (chess.isCheck()) {
          const board = chess.board();
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              const piece = board[r][c];
              if (piece && piece.type === 'k' && piece.color === chess.turn()) {
                const squareName = String.fromCharCode(97 + c) + (8 - r);
                newHighlights[squareName] = { 
                  backgroundColor: 'rgba(239, 68, 68, 0.6)', 
                  boxShadow: 'inset 0 0 10px #ef4444' 
                };
              }
            }
          }
        }

        const capturedPieces = calculateCapturedPieces(chess);
        const materialDifference = getMaterialDifference(capturedPieces);

        // Update state
        set({
          fen: chess.fen(),
          history: chess.history({ verbose: true }),
          captured: capturedPieces,
          materialDiff: materialDifference,
          highlightSquares: newHighlights,
          clocks: newClocks
        });

        // Check for Game Over conditions
        if (chess.isGameOver()) {
          get().handleGameOver(chess);
        } else if (gameMode === 'ai' && chess.turn() !== playerColor) {
          // Trigger AI turn
          get().triggerAiMove();
        }
        return true;
      }
    } catch (e) {
      console.error("Invalid move attempted:", e);
      return false;
    }
    return false;
  },

  // Trigger AI move execution asynchronously
  triggerAiMove: async () => {
    const { fen, status, aiDifficulty, clocks, timeControl } = get();
    if (status !== 'playing') return;

    set({ isAiThinking: true });
    const chess = new Chess(fen);
    
    // Fetch move from stockfish (or local fallback)
    const bestMove = await getBestMove(chess, aiDifficulty);
    
    // Check if player hasn't reset the board while AI was calculating
    if (get().status !== 'playing' || get().fen !== fen) {
      set({ isAiThinking: false });
      return;
    }

    try {
      const move = chess.move(bestMove);
      if (move) {
        if (chess.isCheck()) {
          soundEffects.playCheck();
        } else if (move.captured) {
          soundEffects.playCapture();
        } else {
          soundEffects.playMove();
        }

        // Apply AI Increment if active
        let newClocks = { ...clocks };
        const aiColor = chess.turn() === 'w' ? 'b' : 'w'; // Turn has switched, so AI was active color
        if (timeControl.increment > 0) {
          newClocks[aiColor] = clocks[aiColor] + timeControl.increment;
        }

        // Generate highlight styles for the last move
        const newHighlights = {
          [move.from]: { backgroundColor: 'rgba(0, 240, 255, 0.4)' },
          [move.to]: { backgroundColor: 'rgba(0, 240, 255, 0.4)' }
        };

        // Red highlighting for King in check
        if (chess.isCheck()) {
          const board = chess.board();
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              const piece = board[r][c];
              if (piece && piece.type === 'k' && piece.color === chess.turn()) {
                const squareName = String.fromCharCode(97 + c) + (8 - r);
                newHighlights[squareName] = { 
                  backgroundColor: 'rgba(239, 68, 68, 0.6)', 
                  boxShadow: 'inset 0 0 10px #ef4444' 
                };
              }
            }
          }
        }

        const capturedPieces = calculateCapturedPieces(chess);
        const materialDifference = getMaterialDifference(capturedPieces);

        set({
          fen: chess.fen(),
          history: chess.history({ verbose: true }),
          captured: capturedPieces,
          materialDiff: materialDifference,
          highlightSquares: newHighlights,
          isAiThinking: false,
          clocks: newClocks
        });

        if (chess.isGameOver()) {
          get().handleGameOver(chess);
        }
      }
    } catch (e) {
      console.error("AI error executing move:", e);
      set({ isAiThinking: false });
    }
  },

  // Undo last move
  undoMove: () => {
    const { fen, gameMode, playerColor, status, isAiThinking } = get();
    if ((status !== 'playing' && status !== 'paused') || isAiThinking) return;

    const chess = new Chess(fen);
    
    // In PVAI, undoing moves back to player's turn requires two undos
    if (gameMode === 'ai') {
      // If it's AI's turn to move, undoing 1 move gets to player's last turn
      if (chess.turn() !== playerColor) {
        chess.undo();
      } else {
        // If it's player's turn, undoing 1 move gets to AI's move, so undo 2 to get to player's previous turn
        chess.undo();
        chess.undo();
      }
    } else {
      // PVP mode: undo exactly 1 move
      chess.undo();
    }

    const capturedPieces = calculateCapturedPieces(chess);
    const materialDifference = getMaterialDifference(capturedPieces);

    soundEffects.playMove();

    set({
      fen: chess.fen(),
      history: chess.history({ verbose: true }),
      captured: capturedPieces,
      materialDiff: materialDifference,
      highlightSquares: {}
    });
  },

  // Handle various ending conditions
  handleGameOver: (chess) => {
    const currentInterval = get().timerIntervalId;
    if (currentInterval) clearInterval(currentInterval);

    let winner = null;
    let status = 'draw';

    if (chess.isCheckmate()) {
      status = 'checkmate';
      // In chess.js, turn() is the color whose turn it is now (i.e., the one who was checkmated).
      // So the winner is the OTHER player.
      winner = chess.turn() === 'w' ? 'b' : 'w';
      
      const { playerColor, gameMode } = get();
      if (gameMode === 'ai') {
        if (winner === playerColor) {
          soundEffects.playVictory();
        } else {
          soundEffects.playDefeat();
        }
      } else {
        soundEffects.playVictory();
      }
    } else {
      // Draw conditions
      soundEffects.playCheckmate(); // Neutral ending sound
      if (chess.isStalemate()) status = 'stalemate';
      else if (chess.isThreefoldRepetition()) status = 'draw'; // Threefold repetition
      else if (chess.isInsufficientMaterial()) status = 'draw';
    }

    // Record statistics
    get().recordGameResult(winner, status);

    set({ status, winner });
  },

  // Update statistics and persist to LocalStorage
  recordGameResult: (winner, endReason) => {
    const { gameMode, playerColor, stats, history } = get();
    if (gameMode !== 'ai') return; // Only track stats for AI matches to reflect single-player progress

    const newStats = { ...stats };
    newStats.gamesPlayed += 1;
    newStats.movesCount += Math.ceil(history.length / 2);

    if (winner === null) {
      newStats.draws += 1;
    } else if (winner === playerColor) {
      newStats.wins += 1;
    } else {
      newStats.losses += 1;
    }

    localStorage.setItem('chess_stats', JSON.stringify(newStats));
    set({ stats: newStats });
  },

  // Manual board FEN import
  importFen: (fenString) => {
    try {
      const chess = new Chess(fenString);
      const capturedPieces = calculateCapturedPieces(chess);
      const materialDifference = getMaterialDifference(capturedPieces);

      // Stop current clocks, set to custom or keep
      const currentInterval = get().timerIntervalId;
      if (currentInterval) clearInterval(currentInterval);

      set({
        fen: fenString,
        history: chess.history({ verbose: true }),
        captured: capturedPieces,
        materialDiff: materialDifference,
        highlightSquares: {},
        status: 'playing',
        winner: null,
        isAiThinking: false
      });

      get().startTimer();

      // Trigger AI if it's AI's turn
      if (get().gameMode === 'ai' && chess.turn() !== get().playerColor) {
        get().triggerAiMove();
      }
      return true;
    } catch (e) {
      console.error("Failed to import FEN:", e);
      return false;
    }
  }
}));
