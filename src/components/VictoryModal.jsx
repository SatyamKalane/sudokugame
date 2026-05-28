import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function VictoryModal() {
  const { isWon, score, mistakes, startNewGame } = useGame();

  useEffect(() => {
    if (isWon) {
      // Explode beautiful particle rings instantly on execution
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  }, [isWon]);

  return (
    <AnimatePresence>
      {isWon && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
            className="bg-slate-900 border border-neonCyan/40 p-8 rounded-3xl max-w-sm w-full text-center shadow-neonGlow"
          >
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonPurp mb-2 uppercase tracking-widest animate-pulse">
              Grid Cleared
            </h2>
            <p className="text-white/60 text-sm mb-6">You solved the matrix calculations perfectly.</p>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 flex flex-col gap-2">
              <div className="flex justify-between"><span className="text-white/40">Final Score:</span><span className="text-neonCyan font-bold">{score} XP</span></div>
              <div className="flex justify-between"><span className="text-white/40">Mistakes:</span><span className="text-red-400 font-bold">{mistakes}</span></div>
            </div>

            <button onClick={() => startNewGame()} className="w-full py-3 bg-gradient-to-r from-neonCyan to-neonPurp text-white font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all">
              Initialize Next Level
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
