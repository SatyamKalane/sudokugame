import React from 'react';
import { useGame } from '../context/GameContext';
import Cell from './Cell';

export default function Board() {
  const game = useGame();

  // Loading fallback placeholder grid
  if (!game || !game.currentBoard || game.currentBoard.length === 0) {
    return (
      <div className="flex items-center justify-center bg-slate-900/80 p-2 rounded-2xl border border-white/10 w-full max-w-[480px] aspect-square text-white/40 font-bold tracking-widest uppercase">
        Powering Up Matrix...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-9 bg-slate-900/80 p-2 rounded-2xl border border-white/10 backdrop-blur-xl shadow-neonGlow max-w-[480px] w-full aspect-square gap-[2px]">
      {Array(9).fill(null).map((_, r) => 
        Array(9).fill(null).map((_, c) => (
          <Cell key={`${r}-${c}`} row={r} col={c} />
        ))
      )}
    </div>
  );
}
