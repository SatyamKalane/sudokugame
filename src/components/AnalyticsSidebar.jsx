import React from 'react';
import { useGame } from '../context/GameContext';
import { X, Award, BarChart2, Zap, Target } from 'lucide-react';

export default function AnalyticsSidebar({ isOpen, onClose }) {
  const { stats } = useGame();

  if (!isOpen) return null;

  // Formatter safety parser to map division equations safely
  const calculateAccuracy = () => {
    if (!stats.totalMoves) return 0;
    return Math.floor((stats.correctMoves / stats.totalMoves) * 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in select-none">
      {/* Dimmed backdrop barrier layer */}
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Control Drawer Slate */}
      <div className="relative w-full max-w-xs bg-slate-950 border-l border-white/10 h-full p-6 flex flex-col gap-6 text-white shadow-2xl z-10">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <BarChart2 size={20} />
            <h2 className="font-black uppercase tracking-wider text-sm">System Diagnostics</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Analytical Cards Array List */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-1">
          <div className="bg-slate-900 border border-white/5 p-4 rounded-xl flex items-center gap-4">
            <Zap className="text-yellow-400" size={24} />
            <div>
              <div className="text-[10px] text-white/40 uppercase font-bold">Games Tracked</div>
              <div className="text-xl font-mono font-black">{stats.gamesPlayed}</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/5 p-4 rounded-xl flex items-center gap-4">
            <Award className="text-purple-400" size={24} />
            <div>
              <div className="text-[10px] text-white/40 uppercase font-bold">Total Matrix Wins</div>
              <div className="text-xl font-mono font-black text-purple-400">{stats.totalWins}</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/5 p-4 rounded-xl flex items-center gap-4">
            <Target className="text-emerald-400" size={24} />
            <div>
              <div className="text-[10px] text-white/40 uppercase font-bold">Calculation Accuracy</div>
              <div className="text-xl font-mono font-black text-emerald-400">{calculateAccuracy()}%</div>
            </div>
          </div>

          {/* Graphical Accuracy Matrix Meter Indicator Bar */}
          <div className="bg-slate-900 border border-white/5 p-4 rounded-xl">
            <div className="text-[10px] text-white/40 uppercase font-bold mb-2">Data Processing Integrity</div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-1000"
                style={{ width: `${calculateAccuracy()}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-auto text-center text-[10px] text-white/20 uppercase tracking-widest font-bold">
          Neon Sudoku // v2.0.0
        </div>
      </div>
    </div>
  );
}
