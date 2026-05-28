import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { generateSudoku } from '../utils/sudokuEngine';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [difficulty, setDifficulty] = useState(() => localStorage.getItem('neon_diff') || 'medium');
  const [solutionBoard, setSolutionBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [currentBoard, setCurrentBoard] = useState([]);
  const [notesBoard, setNotesBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])));
  const [selectedCell, setSelectedCell] = useState(null);
  const [history, setHistory] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [score, setScore] = useState(0);
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('neon_theme') || 'cyberpunk');
  const [isWon, setIsWon] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Advanced Combo Mechanics
  const [combo, setCombo] = useState(0);
  const lastCorrectTimeRef = useRef(0);

  // Time Engine Matrix
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Permanent Lifetime Analytical Profiles Tracker
  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem('neon_lifetime_analytics');
    return savedStats ? JSON.parse(savedStats) : { gamesPlayed: 0, totalWins: 0, perfectWins: 0, totalMoves: 0, correctMoves: 0 };
  });

  const startNewGame = (diff = difficulty) => {
    const { solution, initial } = generateSudoku(diff);
    setSolutionBoard(solution);
    setInitialBoard(initial);
    setCurrentBoard(initial.map(row => [...row]));
    setNotesBoard(Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])));
    setSelectedCell(null);
    setHistory([]);
    setMistakes(0);
    setScore(0);
    setIsWon(false);
    setSeconds(0);
    setIsPaused(false);
    setCombo(0);
    localStorage.removeItem('neon_save_state');
    
    setStats(prev => {
      const updated = { ...prev, gamesPlayed: prev.gamesPlayed + 1 };
      localStorage.setItem('neon_lifetime_analytics', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem('neon_save_state');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSolutionBoard(data.solutionBoard);
        setInitialBoard(data.initialBoard);
        setCurrentBoard(data.currentBoard);
        setNotesBoard(data.notesBoard);
        setMistakes(data.mistakes);
        setScore(data.score);
        setSeconds(data.seconds);
        setDifficulty(data.difficulty);
        setTheme(data.theme || 'cyberpunk');
        setCombo(data.combo || 0);
        return;
      } catch (e) { localStorage.removeItem('neon_save_state'); }
    }
    startNewGame(difficulty);
  }, []);

  useEffect(() => {
    if (currentBoard.length > 0 && !isWon) {
      const stateToSave = { solutionBoard, initialBoard, currentBoard, notesBoard, mistakes, score, seconds, difficulty, theme, combo };
      localStorage.setItem('neon_save_state', JSON.stringify(stateToSave));
    }
  }, [currentBoard, notesBoard, mistakes, score, seconds, difficulty, theme, combo, isWon]);

  useEffect(() => {
    if (!isPaused && !isWon) {
      timerRef.current = setInterval(() => setSeconds(p => p + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPaused, isWon]);

  // Decaying Combo Engine Monitor Loop
  useEffect(() => {
    const comboTicker = setInterval(() => {
      if (combo > 0) {
        const now = Date.now();
        if (now - lastCorrectTimeRef.current > 15000) {
          setCombo(0);
        }
      }
    }, 1000);
    return () => clearInterval(comboTicker);
  }, [combo]);

  // Synthesized Polyphonic Oscillator Engine (Bypasses missing asset bugs completely)
  const dynamicSynthAudio = (audioMatrixProfile) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscNode = audioCtx.createOscillator();
      const volumeControl = audioCtx.createGain();
      oscNode.connect(volumeControl);
      volumeControl.connect(audioCtx.destination);

      if (audioMatrixProfile === 'success') {
        const pitchFreq = 300 + (combo * 75); // Pitch dynamically scales up with higher combo multipliers!
        oscNode.frequency.setValueAtTime(pitchFreq, audioCtx.currentTime);
        volumeControl.gain.setValueAtTime(0.12, audioCtx.currentTime);
        volumeControl.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
        oscNode.start(); oscNode.stop(audioCtx.currentTime + 0.18);
      } else if (audioMatrixProfile === 'fail') {
        oscNode.type = 'sawtooth';
        oscNode.frequency.setValueAtTime(110, audioCtx.currentTime);
        volumeControl.gain.setValueAtTime(0.15, audioCtx.currentTime);
        volumeControl.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        oscNode.start(); oscNode.stop(audioCtx.currentTime + 0.35);
      } else if (audioMatrixProfile === 'victory') {
        const chordNotes = [523.25, 659.25, 783.99, 1046.50];
        chordNotes.forEach((f, index) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain); gain.connect(audioCtx.destination);
          osc.frequency.setValueAtTime(f, audioCtx.currentTime + (index * 0.1));
          gain.gain.setValueAtTime(0.15, audioCtx.currentTime + (index * 0.1));
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (index * 0.1) + 0.5);
          osc.start(); osc.stop(audioCtx.currentTime + (index * 0.1) + 0.5);
        });
      }
    } catch (error) {}
  };

  const updateCellValue = (num) => {
    if (!selectedCell || isPaused || isWon) return;
    const { row, col } = selectedCell;
    if (initialBoard[row]?.[col] !== 0) return;

    setHistory([...history, JSON.stringify(currentBoard)]);

    if (isNoteMode) {
      if (num === 0) return;
      const currentNotes = [...notesBoard[row][col]];
      const updatedNotes = currentNotes.includes(num)
        ? currentNotes.filter(n => n !== num)
        : [...currentNotes, num].sort();
      const nextNotes = [...notesBoard];
      nextNotes[row][col] = updatedNotes;
      setNotesBoard(nextNotes);
      return;
    }

    const nextBoard = currentBoard.map(r => [...r]);
    nextBoard[row][col] = num;
    setCurrentBoard(nextBoard);

    setStats(p => ({ ...p, totalMoves: p.totalMoves + 1 }));

    if (num !== solutionBoard[row][col] && num !== 0) {
      setMistakes(prev => prev + 1);
      setCombo(0);
      setScore(prev => Math.max(0, prev - 50));
      dynamicSynthAudio('fail');
    } else if (num !== 0) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      lastCorrectTimeRef.current = Date.now();

      // Apply score multipliers dynamically based on active combo level
      const basePoints = 100;
      const calculatedPointsMultiplier = nextCombo > 1 ? basePoints * (1 + nextCombo * 0.25) : basePoints;
      setScore(prev => prev + Math.floor(calculatedPointsMultiplier));
      
      dynamicSynthAudio('success');
      setStats(p => ({ ...p, correctMoves: p.correctMoves + 1 }));

      // Clean notes line collisions automatically
      const nextNotes = [...notesBoard];
      for (let i = 0; i < 9; i++) {
        if (nextNotes[row] && nextNotes[row][i]) {
          nextNotes[row][i] = nextNotes[row][i].filter(n => n !== num);
        }
        if (nextNotes[i] && nextNotes[i][col]) {
          nextNotes[i][col] = nextNotes[i][col].filter(n => n !== num);
        }
      }
      setNotesBoard(nextNotes);
    }

    if (JSON.stringify(nextBoard) === JSON.stringify(solutionBoard)) {
      setIsWon(true);
      dynamicSynthAudio('victory');
      setStats(p => ({
        ...p,
        totalWins: p.totalWins + 1,
        perfectWins: mistakes === 0 ? p.perfectWins + 1 : p.perfectWins
      }));
    }

    setStats(p => {
      localStorage.setItem('neon_lifetime_analytics', JSON.stringify(p));
      return p;
    });
  };

  const undoAction = () => {
    if (history.length === 0 || isPaused) return;
    setCurrentBoard(JSON.parse(history[history.length - 1]));
    setHistory(history.slice(0, -1));
  };

  const triggerHint = () => {
    if (!selectedCell || isPaused) return;
    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== 0) return;
    updateCellValue(solutionBoard[row][col]);
    setScore(prev => Math.max(0, prev - 150));
    setCombo(0); // Hints break active combo streaks!
  };

  const togglePause = () => setIsPaused(!isPaused);

  return (
    <GameContext.Provider value={{
      difficulty, setDifficulty, solutionBoard, initialBoard, currentBoard, notesBoard,
      selectedCell, setSelectedCell, mistakes, score, isNoteMode, setIsNoteMode,
      theme, setTheme, isWon, seconds, isPaused, togglePause, startNewGame, updateCellValue, undoAction, triggerHint,
      combo, soundEnabled, setSoundEnabled, stats
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
