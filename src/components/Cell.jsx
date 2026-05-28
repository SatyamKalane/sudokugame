import React from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';

export default function Cell({ row, col }) {
  const game = useGame();

  // If the game context isn't fully ready yet, render a beautiful placeholder cell
  if (!game || !game.currentBoard || !game.currentBoard[row]) {
    return <div className="bg-slate-800/40 aspect-square border border-white/5 rounded-md" />;
  }

  const { currentBoard, initialBoard, solutionBoard, selectedCell, setSelectedCell, notesBoard } = game;

  const val = currentBoard[row][col];
  const isInitial = initialBoard && initialBoard[row] && initialBoard[row][col] !== 0;
  const isSelected = selectedCell?.row === row && selectedCell?.col === col;
  
  // Highlighting intersections and matching numbers safety check
  const currentSelectedVal = selectedCell && currentBoard[selectedCell.row] ? currentBoard[selectedCell.row][selectedCell.col] : 0;
  
  const isHighlighted = selectedCell && (
    selectedCell.row === row || 
    selectedCell.col === col || 
    (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) && Math.floor(selectedCell.col / 3) === Math.floor(col / 3)) ||
    (val !== 0 && currentSelectedVal === val)
  );

  const isWrong = val !== 0 && !isInitial && solutionBoard && solutionBoard[row] && val !== solutionBoard[row][col];

  // Accent board line splits for 3x3 blocks
  const borderClasses = `
    ${row % 3 === 0 && row !== 0 ? 'border-t-2 border-white/40' : ''}
    ${col % 3 === 0 && col !== 0 ? 'border-l-2 border-white/40' : ''}
  `;

  return (
    <motion.div
      onClick={() => setSelectedCell({ row, col })}
      whileHover={{ scale: 1.03 }}
      className={`relative flex items-center justify-center cursor-pointer font-bold transition-all text-xl select-none aspect-square rounded-md
        ${borderClasses}
        ${isInitial ? 'text-white font-black' : 'text-neonCyan'}
        ${isSelected ? 'bg-neonCyan/30 shadow-neonGlow' : isHighlighted ? 'bg-white/5' : 'bg-slate-800/40'}
        ${isWrong ? 'bg-red-500/20 text-red-400 border border-red-500 shadow-neonRed' : 'border border-white/5'}
      `}
    >
      {val !== 0 ? (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>{val}</motion.span>
      ) : (
        <div className="grid grid-cols-3 grid-rows-3 gap-[1px] w-full h-full p-[2px] text-[9px] text-white/40 leading-none">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <span key={n} className="flex items-center justify-center">
              {notesBoard && notesBoard[row] && notesBoard[row][col]?.includes(n) ? n : ''}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
